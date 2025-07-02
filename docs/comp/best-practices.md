---
sidebar_position: 6
title: Best Practices
---

# Best Practices

This guide outlines recommended practices for integrating and using the Cardano.Metadata service effectively. Following these guidelines ensures optimal performance, security, and maintainability of your applications while avoiding common pitfalls. These practices are derived from real-world deployments and community feedback.

---

## API Integration

### Connection Management

Proper HTTP client configuration prevents resource exhaustion and improves application performance. The HttpClient class should be instantiated once and reused throughout the application lifecycle to enable connection pooling. Creating multiple instances leads to socket exhaustion and unnecessary TCP handshake overhead:

**Good Configuration Approach:**
This singleton pattern reuses a single HttpClient instance throughout the application lifecycle, enabling effective connection pooling and DNS cache reuse. The SocketsHttpHandler configuration optimizes connection management with proper timeouts and pool sizes. Compression headers and keep-alive connections minimize bandwidth usage and handshake overhead.

```csharp
// Good: Singleton HttpClient with proper configuration
public class MetadataService
{
    private static readonly HttpClient _httpClient = new HttpClient(new SocketsHttpHandler
    {
        PooledConnectionLifetime = TimeSpan.FromMinutes(5),
        PooledConnectionIdleTimeout = TimeSpan.FromMinutes(2),
        MaxConnectionsPerServer = 10,
        AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
    })
    {
        BaseAddress = new Uri("http://localhost:5000"),
        Timeout = TimeSpan.FromSeconds(30),
        DefaultRequestHeaders = 
        {
            { "Accept", "application/json" },
            { "Accept-Encoding", "gzip, deflate" },
            { "User-Agent", "MyApp/1.0" },
            { "Connection", "keep-alive" }
        }
    };

    public async Task<T> GetDataAsync<T>(string endpoint)
    {
        var response = await _httpClient.GetAsync(endpoint);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>();
    }
}
```

**Bad Configuration Approach:**
Creating new HttpClient instances for each request bypasses connection pooling and forces expensive TCP handshakes for every call. Disposed connections enter TIME_WAIT state, consuming system resources and potentially exhausting available ports under load. This pattern significantly degrades performance and can cause connection failures in high-traffic scenarios.

```csharp
// Bad: Creating new HttpClient for each request
public async Task<T> GetDataBadExample<T>(string endpoint)
{
    using var client = new HttpClient(); // Socket exhaustion risk
    var response = await client.GetAsync($"http://localhost:5000{endpoint}");
    return await response.Content.ReadFromJsonAsync<T>();
}
```

### Error Handling

Implement comprehensive error handling to gracefully manage API failures and provide meaningful feedback to users. Proper error handling distinguishes between different failure types - network issues, server errors, rate limiting, and validation failures. Each error type requires specific handling strategies to ensure application resilience. Use structured result types to propagate error information through application layers while maintaining clean separation of concerns:

```csharp
public class RobustMetadataClient
{
    private readonly ILogger<RobustMetadataClient> _logger;
    private readonly HttpClient _httpClient;

    public async Task<Result<TokenMetadata>> GetTokenSafelyAsync(string subject)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/metadata/token/{subject}");
            
            switch (response.StatusCode)
            {
                case HttpStatusCode.OK:
                    var data = await response.Content.ReadFromJsonAsync<TokenMetadata>();
                    return Result<TokenMetadata>.Success(data);
                    
                case HttpStatusCode.NotFound:
                    _logger.LogInformation($"Token not found: {subject}");
                    return Result<TokenMetadata>.NotFound($"Token {subject} not found");
                    
                case HttpStatusCode.TooManyRequests:
                    var retryAfter = response.Headers.RetryAfter?.Delta?.TotalSeconds ?? 60;
                    _logger.LogWarning($"Rate limited, retry after {retryAfter} seconds");
                    return Result<TokenMetadata>.RateLimited((int)retryAfter);
                    
                case HttpStatusCode.InternalServerError:
                case HttpStatusCode.BadGateway:
                case HttpStatusCode.ServiceUnavailable:
                    _logger.LogError($"Server error: {response.StatusCode}");
                    return Result<TokenMetadata>.ServerError("Service temporarily unavailable");
                    
                default:
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Unexpected response: {response.StatusCode} - {error}");
                    return Result<TokenMetadata>.Error($"Unexpected error: {response.StatusCode}");
            }
        }
        catch (TaskCanceledException)
        {
            _logger.LogError("Request timeout");
            return Result<TokenMetadata>.Error("Request timed out");
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Network error");
            return Result<TokenMetadata>.Error("Network error occurred");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error");
            return Result<TokenMetadata>.Error("An unexpected error occurred");
        }
    }
}

public class Result<T>
{
    public bool IsSuccess { get; init; }
    public T Data { get; init; }
    public string ErrorMessage { get; init; }
    public int? RetryAfterSeconds { get; init; }
    
    public static Result<T> Success(T data) => new() { IsSuccess = true, Data = data };
    public static Result<T> NotFound(string message) => new() { IsSuccess = false, ErrorMessage = message };
    public static Result<T> RateLimited(int retryAfter) => new() { IsSuccess = false, RetryAfterSeconds = retryAfter };
    public static Result<T> ServerError(string message) => new() { IsSuccess = false, ErrorMessage = message };
    public static Result<T> Error(string message) => new() { IsSuccess = false, ErrorMessage = message };
}
```

### Rate Limiting

Respect API rate limits to maintain service availability for all users. Client-side rate limiting prevents overwhelming the API and ensures fair resource usage across all consumers. Implement proactive throttling to stay within limits rather than reactive handling after receiving 429 responses. Use sliding window algorithms to track request rates accurately and queue mechanisms to smooth traffic spikes. Combine this with exponential backoff for retry scenarios:

```csharp
public class RateLimitedClient
{
    private readonly SemaphoreSlim _semaphore;
    private readonly Queue<DateTime> _requestTimes;
    private readonly int _maxRequestsPerMinute;
    
    public RateLimitedClient(int maxRequestsPerMinute = 60)
    {
        _maxRequestsPerMinute = maxRequestsPerMinute;
        _semaphore = new SemaphoreSlim(1, 1);
        _requestTimes = new Queue<DateTime>();
    }
    
    public async Task<T> ExecuteWithRateLimitAsync<T>(Func<Task<T>> operation)
    {
        await _semaphore.WaitAsync();
        try
        {
            // Clean old entries
            var cutoff = DateTime.UtcNow.AddMinutes(-1);
            while (_requestTimes.Count > 0 && _requestTimes.Peek() < cutoff)
            {
                _requestTimes.Dequeue();
            }
            
            // Check rate limit
            if (_requestTimes.Count >= _maxRequestsPerMinute)
            {
                var oldestRequest = _requestTimes.Peek();
                var waitTime = oldestRequest.AddMinutes(1) - DateTime.UtcNow;
                
                if (waitTime > TimeSpan.Zero)
                {
                    await Task.Delay(waitTime);
                }
            }
            
            // Execute operation
            _requestTimes.Enqueue(DateTime.UtcNow);
            return await operation();
        }
        finally
        {
            _semaphore.Release();
        }
    }
}

// Usage
var rateLimitedClient = new RateLimitedClient(maxRequestsPerMinute: 60);
var result = await rateLimitedClient.ExecuteWithRateLimitAsync(async () =>
{
    return await httpClient.GetFromJsonAsync<TokenMetadata>("/api/metadata/token/abc123");
});
```

---

## Performance Optimization

### Caching Strategies

Implement intelligent caching to reduce API calls and improve response times. Use appropriate cache invalidation strategies based on data volatility:

**Multi-Layer Caching Implementation:**
This approach implements a two-tier caching strategy with memory cache for immediate access and distributed cache for shared data across application instances. The system checks the fastest cache first, then falls back to slower tiers before making API calls. Cache expiration policies are configured differently for each layer based on access patterns and data freshness requirements.

```csharp
public class CachedMetadataService
{
    private readonly IMemoryCache _memoryCache;
    private readonly IDistributedCache _distributedCache;
    private readonly HttpClient _httpClient;
    
    public async Task<TokenMetadata> GetTokenWithCachingAsync(string subject)
    {
        // L1 Cache: Memory cache for hot data
        if (_memoryCache.TryGetValue($"token_{subject}", out TokenMetadata cached))
        {
            return cached;
        }
        
        // L2 Cache: Distributed cache for warm data
        var distributedKey = $"metadata:token:{subject}";
        var cachedJson = await _distributedCache.GetStringAsync(distributedKey);
        
        if (!string.IsNullOrEmpty(cachedJson))
        {
            var token = JsonSerializer.Deserialize<TokenMetadata>(cachedJson);
            _memoryCache.Set($"token_{subject}", token, TimeSpan.FromMinutes(5));
            return token;
        }
        
        // Fetch from API and cache in both layers
        var response = await _httpClient.GetFromJsonAsync<TokenMetadata>($"/api/metadata/token/{subject}");
        
        var cacheEntryOptions = new MemoryCacheEntryOptions()
            .SetSlidingExpiration(TimeSpan.FromMinutes(5))
            .SetAbsoluteExpiration(TimeSpan.FromHours(1))
            .SetPriority(CacheItemPriority.Normal);
            
        _memoryCache.Set($"token_{subject}", response, cacheEntryOptions);
        
        await _distributedCache.SetStringAsync(
            distributedKey,
            JsonSerializer.Serialize(response),
            new DistributedCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(15),
                AbsoluteExpiration = TimeSpan.FromHours(4)
            }
        );
        
        return response;
    }
}
```

**Cache Invalidation Pattern:**
Proper cache invalidation ensures data consistency when metadata changes occur. This pattern removes entries from all cache layers simultaneously to prevent stale data. Implement this for write operations or when receiving webhook notifications about metadata updates.

```csharp
public async Task InvalidateTokenCacheAsync(string subject)
{
    _memoryCache.Remove($"token_{subject}");
    await _distributedCache.RemoveAsync($"metadata:token:{subject}");
}
```

### Batch Operations

When processing multiple items, use batch operations to minimize API calls and improve throughput:

**Parallel Batch Processing:**
This implementation processes large datasets efficiently by chunking items into smaller batches and executing them in parallel with controlled concurrency. The approach reduces total processing time while respecting API rate limits and preventing resource exhaustion. Using ConcurrentBag ensures thread-safe result collection across parallel operations.

```csharp
public class BatchProcessor
{
    private readonly HttpClient _httpClient;
    private const int BatchSize = 100;
    
    public async Task<List<TokenMetadata>> ProcessTokensAsync(List<string> subjects)
    {
        var results = new ConcurrentBag<TokenMetadata>();
        var batches = subjects.Chunk(BatchSize);
        
        // Process batches in parallel with controlled concurrency
        var parallelOptions = new ParallelOptions
        {
            MaxDegreeOfParallelism = 3 // Limit concurrent requests
        };
        
        await Parallel.ForEachAsync(batches, parallelOptions, async (batch, ct) =>
        {
            var batchRequest = new
            {
                subjects = batch.ToList()
            };
            
            var response = await _httpClient.PostAsJsonAsync(
                "/api/metadata/tokens/batch", 
                batchRequest,
                ct
            );
            
            if (response.IsSuccessStatusCode)
            {
                var tokens = await response.Content.ReadFromJsonAsync<List<TokenMetadata>>(ct);
                foreach (var token in tokens)
                {
                    results.Add(token);
                }
            }
        });
        
        return results.ToList();
    }
}
```

### Query Optimization

Structure your queries efficiently to minimize data transfer and processing time:

**Good Query Practices:**
This approach demonstrates efficient API usage by requesting only required fields and applying server-side filtering. Field selection reduces payload size and network transfer time, while server-side filtering minimizes the amount of data processed and returned. These optimizations significantly improve performance, especially with large datasets.

```csharp
// Good: Request only needed fields and use server-side filtering
public class OptimizedQueryService
{
    public async Task<List<TokenSummary>> GetTokenSummariesAsync(string policyId)
    {
        var response = await _httpClient.GetFromJsonAsync<List<TokenSummary>>(
            $"/api/metadata/tokens?policyId={policyId}&fields=subject,name,ticker,logo"
        );
        return response;
    }
    
    public async Task<List<TokenMetadata>> GetVerifiedTokensAsync()
    {
        return await _httpClient.GetFromJsonAsync<List<TokenMetadata>>(
            "/api/metadata/tokens?verified=true&hasLogo=true"
        );
    }
}
```

**Inefficient Query Patterns:**
These examples show common performance anti-patterns that waste bandwidth and processing resources. Over-fetching data by requesting all fields when only specific ones are needed increases response times and memory usage. Client-side filtering forces unnecessary data transfer and places filtering logic on the client rather than the optimized database layer.

```csharp
// Bad: Over-fetching and client-side filtering
public class InefficientQueryService
{
    public async Task<List<string>> GetTokenNamesBadExample(string policyId)
    {
        var tokens = await _httpClient.GetFromJsonAsync<List<TokenMetadata>>(
            $"/api/metadata/tokens?policyId={policyId}"
        );
        return tokens.Select(t => t.Name).ToList();
    }
    
    public async Task<List<TokenMetadata>> GetVerifiedTokensBadExample()
    {
        var allTokens = await _httpClient.GetFromJsonAsync<List<TokenMetadata>>(
            "/api/metadata/tokens"
        );
        return allTokens.Where(t => t.Verified && t.Logo != null).ToList();
    }
}
```

---

## Data Integrity

### Metadata Validation

Always validate metadata before submission to ensure compliance with standards:

**CIP-25 Compliance Validation:**
This comprehensive validator ensures NFT metadata adheres to the CIP-25 standard with proper field validation and byte length checking. The implementation validates required fields, enforces the 64-byte limit on string fields, and checks media type compatibility. Structured error reporting provides actionable feedback for metadata correction and compliance.

```csharp
public class MetadataValidator
{
    public ValidationResult ValidateCip25Metadata(Cip25Metadata metadata)
    {
        var errors = new List<string>();
        
        // Required fields
        if (string.IsNullOrEmpty(metadata.Name))
            errors.Add("Name is required");
            
        if (string.IsNullOrEmpty(metadata.Image))
            errors.Add("Image is required");
            
        if (string.IsNullOrEmpty(metadata.MediaType))
            errors.Add("MediaType is required");
            
        // String length validation (64-byte limit)
        if (GetByteCount(metadata.Name) > 64)
            errors.Add("Name exceeds 64 byte limit");
            
        if (metadata.Description != null && GetByteCount(metadata.Description) > 64)
            errors.Add("Description exceeds 64 byte limit. Use array format for longer content.");
            
        // Media type validation
        var validMediaTypes = new[] { "image/png", "image/jpeg", "image/gif", "image/svg+xml", "video/mp4" };
        if (!validMediaTypes.Contains(metadata.MediaType))
            errors.Add($"Invalid media type: {metadata.MediaType}");
            
        // Files validation
        if (metadata.Files != null)
        {
            foreach (var file in metadata.Files)
            {
                if (string.IsNullOrEmpty(file.Name))
                    errors.Add("File name is required");
                    
                if (string.IsNullOrEmpty(file.MediaType))
                    errors.Add("File media type is required");
                    
                if (string.IsNullOrEmpty(file.Src))
                    errors.Add("File source is required");
            }
        }
        
        return new ValidationResult
        {
            IsValid = errors.Count == 0,
            Errors = errors
        };
    }
    
    private int GetByteCount(string text)
    {
        return Encoding.UTF8.GetByteCount(text);
    }
}
```

### Signature Verification

Verify metadata signatures to ensure authenticity:

**RSA Signature Verification:**
This service validates cryptographic signatures to ensure metadata authenticity and prevent tampering. The implementation checks against trusted public keys and verifies RSA signatures using SHA256 hashing. Proper signature verification is essential for maintaining data integrity in decentralized metadata registries.

```csharp
public class SignatureVerificationService
{
    private readonly Dictionary<string, string> _trustedPublicKeys;
    
    public bool VerifyMetadataSignature(ValueResponse<string> metadata, string trustedKeyId)
    {
        if (metadata.Signatures == null || !metadata.Signatures.Any())
            return false;
            
        if (!_trustedPublicKeys.TryGetValue(trustedKeyId, out var publicKey))
            return false;
            
        foreach (var signature in metadata.Signatures)
        {
            if (signature.PublicKey == publicKey)
            {
                // Verify the signature
                var dataToVerify = $"{metadata.Value}:{metadata.SequenceNumber}";
                var dataBytes = Encoding.UTF8.GetBytes(dataToVerify);
                
                using var rsa = RSA.Create();
                rsa.ImportFromPem(publicKey);
                
                var signatureBytes = Convert.FromBase64String(signature.Signature);
                
                if (rsa.VerifyData(dataBytes, signatureBytes, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1))
                {
                    return true;
                }
            }
        }
        
        return false;
    }
}
```

---

## Monitoring and Logging

### Structured Logging

Implement structured logging for better observability:

**Comprehensive Monitoring Implementation:**
This implementation combines structured logging, distributed tracing, and metrics collection for complete observability of API operations. Activity tracking provides correlation IDs for distributed tracing, while structured logging captures detailed context for debugging. Performance metrics and error counters enable real-time monitoring and alerting capabilities.

```csharp
public class MonitoredMetadataService
{
    private readonly ILogger<MonitoredMetadataService> _logger;
    private readonly HttpClient _httpClient;
    private readonly IMetrics _metrics;
    
    public async Task<TokenMetadata> GetTokenWithMonitoringAsync(string subject)
    {
        using var activity = Activity.StartActivity("GetToken");
        activity?.SetTag("token.subject", subject);
        
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            _logger.LogInformation("Fetching token metadata", new
            {
                Subject = subject,
                Operation = "GetToken",
                CorrelationId = Activity.Current?.Id
            });
            
            var response = await _httpClient.GetFromJsonAsync<TokenMetadata>(
                $"/api/metadata/token/{subject}"
            );
            
            stopwatch.Stop();
            
            _logger.LogInformation("Token metadata retrieved successfully", new
            {
                Subject = subject,
                ElapsedMs = stopwatch.ElapsedMilliseconds,
                TokenName = response.Name
            });
            
            _metrics.Measure.Counter.Increment("metadata.requests", new MetricTags("status", "success"));
            _metrics.Measure.Histogram.Update("metadata.response_time", stopwatch.ElapsedMilliseconds);
            
            return response;
        }
        catch (HttpRequestException ex)
        {
            stopwatch.Stop();
            
            _logger.LogError(ex, "Failed to fetch token metadata", new
            {
                Subject = subject,
                ElapsedMs = stopwatch.ElapsedMilliseconds,
                ErrorType = ex.GetType().Name
            });
            
            _metrics.Measure.Counter.Increment("metadata.requests", new MetricTags("status", "error"));
            
            throw;
        }
    }
}
```

### Health Checks

Implement health checks for monitoring service dependencies:

**Service Dependency Monitoring:**
Health checks provide automated monitoring of external service availability and responsiveness for proactive issue detection. This implementation tests actual connectivity to the metadata service endpoint and reports detailed status information. Proper health check configuration enables load balancers and orchestrators to route traffic appropriately based on service health.

```csharp
public class MetadataServiceHealthCheck : IHealthCheck
{
    private readonly HttpClient _httpClient;
    
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("/health", cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                return HealthCheckResult.Healthy("Metadata service is responsive");
            }
            
            return HealthCheckResult.Unhealthy(
                $"Metadata service returned {response.StatusCode}"
            );
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy(
                "Unable to connect to metadata service",
                ex
            );
        }
    }
}

// Register health check
services.AddHealthChecks()
    .AddTypeActivatedCheck<MetadataServiceHealthCheck>(
        "metadata-service",
        failureStatus: HealthStatus.Degraded,
        tags: new[] { "metadata", "external" }
    );
```
