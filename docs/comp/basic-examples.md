---
sidebar_position: 4
title: Basic Examples
---

# Basic Examples

This section provides practical examples demonstrating how to integrate and use the Cardano.Metadata service in real-world applications. Each example includes complete, working code that you can adapt to your specific requirements. From basic queries to advanced integration patterns, these examples cover common scenarios developers encounter when working with Cardano metadata.

---

## Basic Integration

### Setting Up the Client

Initialize and configure the HTTP client for interacting with the COMP service. This example demonstrates proper client configuration with timeout settings, base URL setup, and error handling strategies.

**Main Client Class**

The MetadataServiceClient class serves as the primary interface for communicating with the COMP service. It encapsulates HTTP operations, retry logic, and JSON serialization configuration, providing a robust foundation for all metadata operations.

```csharp
using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Threading;
using Polly;
using Polly.Extensions.Http;

public class MetadataServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _jsonOptions;
    private readonly IAsyncPolicy<HttpResponseMessage> _retryPolicy;

    public MetadataServiceClient(string baseUrl = "http://localhost:5000", 
                                HttpClient httpClient = null)
    {
        _httpClient = httpClient ?? new HttpClient
        {
            BaseAddress = new Uri(baseUrl),
            Timeout = TimeSpan.FromSeconds(30)
        };
        
        // Add default headers
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "COMP-Client/1.0");
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        
        // Configure JSON serialization options
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        };
        
        // Configure retry policy with exponential backoff
        _retryPolicy = HttpPolicyExtensions
            .HandleTransientHttpError()
            .OrResult(msg => !msg.IsSuccessStatusCode)
            .WaitAndRetryAsync(
                3,
                retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
                onRetry: (outcome, timespan, retryCount, context) =>
                {
                    var reason = outcome.Result?.StatusCode.ToString() ?? outcome.Exception?.Message;
                    Console.WriteLine($"Retry {retryCount} after {timespan}ms. Reason: {reason}");
                });
    }
```

**GET Request Method**

The GetAsync method handles all GET requests to the COMP service with built-in retry logic and comprehensive error handling. It automatically deserializes JSON responses into strongly-typed objects and provides detailed exception information for debugging.

```csharp
    public async Task<T> GetAsync<T>(string endpoint, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _retryPolicy.ExecuteAsync(async () =>
                await _httpClient.GetAsync(endpoint, cancellationToken)
            );
            
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            return JsonSerializer.Deserialize<T>(json, _jsonOptions);
        }
        catch (HttpRequestException ex)
        {
            throw new MetadataServiceException($"Failed to fetch data from {endpoint}", ex);
        }
        catch (TaskCanceledException ex)
        {
            throw new MetadataServiceException($"Request to {endpoint} timed out", ex);
        }
        catch (JsonException ex)
        {
            throw new MetadataServiceException($"Failed to parse response from {endpoint}", ex);
        }
    }
```

**POST Request Method**

The PostAsync method enables sending data to the COMP service for operations like metadata updates or batch queries. It handles request serialization, applies the same retry policy as GET requests, and returns typed responses for type-safe development.

```csharp
    public async Task<TResponse> PostAsync<TRequest, TResponse>(
        string endpoint, 
        TRequest data, 
        CancellationToken cancellationToken = default)
    {
        var json = JsonSerializer.Serialize(data, _jsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _retryPolicy.ExecuteAsync(async () =>
            await _httpClient.PostAsync(endpoint, content, cancellationToken)
        );
        
        response.EnsureSuccessStatusCode();
        var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);
        return JsonSerializer.Deserialize<TResponse>(responseJson, _jsonOptions);
    }
}
```

**Custom Exception Class**

The MetadataServiceException provides context-specific error information when service communication fails. This custom exception preserves the original error details while adding metadata-specific context, making it easier to diagnose and handle service-related issues in your application.

```csharp
public class MetadataServiceException : Exception
{
    public MetadataServiceException(string message) : base(message) { }
    public MetadataServiceException(string message, Exception innerException) 
        : base(message, innerException) { }
}
```

**Integration Summary**

Together, these components create a resilient and production-ready client for the COMP service. The main client class establishes the foundation with proper HTTP configuration and retry policies, while the GET and POST methods provide type-safe communication patterns for all metadata operations. The custom exception class ensures that any service-related errors are properly contextualized, making debugging and error handling straightforward in your applications.

### Simple Token Query

Retrieve metadata for a specific token using its subject identifier. This is the most common operation when displaying token information in wallets or applications. The following implementation demonstrates how to query token metadata from the COMP service, validate responses, and handle the various metadata fields that tokens may contain. The service provides comprehensive token information suitable for display in wallets, explorers, and other Cardano applications.

**Token Query Service**

The TokenQueryService class provides a high-level abstraction for retrieving and processing token metadata. It handles validation, transformation, and logging while maintaining separation of concerns between data retrieval and business logic.

```csharp
public class TokenQueryService
{
    private readonly MetadataServiceClient _client;
    private readonly ILogger<TokenQueryService> _logger;

    public TokenQueryService(MetadataServiceClient client, ILogger<TokenQueryService> logger)
    {
        _client = client;
        _logger = logger;
    }
```

**Main Query Method**

The GetTokenInfoAsync method orchestrates the entire token query process from validation through to response transformation. It includes comprehensive error handling, signature verification, and automatic metadata extraction to provide a complete token profile in a single call.

```csharp
    public async Task<TokenInfo> GetTokenInfoAsync(string subject)
    {
        try
        {
            // Validate subject format
            if (!IsValidTokenSubject(subject))
            {
                throw new ArgumentException($"Invalid token subject format: {subject}");
            }

            // Query token metadata
            var token = await _client.GetAsync<RegistryItem>($"/api/metadata/token/{subject}");
            
            if (token == null)
            {
                _logger.LogWarning($"Token not found: {subject}");
                return null;
            }

            // Transform to domain model
            var tokenInfo = new TokenInfo
            {
                Subject = subject,
                PolicyId = ExtractPolicyId(subject),
                AssetName = ExtractAssetName(subject),
                DisplayName = token.Name?.Value ?? "Unknown Token",
                Ticker = token.Ticker?.Value,
                Decimals = token.Decimals?.Value ?? 0,
                Description = token.Description?.Value,
                Logo = token.Logo?.Value,
                Url = token.Url?.Value,
                IsVerified = token.Name?.Signatures?.Any() == true,
                Metadata = ExtractAdditionalMetadata(token)
            };

            // Log verification status
            if (tokenInfo.IsVerified)
            {
                _logger.LogInformation($"Retrieved verified token: {tokenInfo.DisplayName} ({tokenInfo.Ticker})");
                
                // Extract signature details
                tokenInfo.SignatureDetails = token.Name.Signatures.Select(sig => new SignatureInfo
                {
                    AttestationKey = sig.AttestationSignature?.PublicKey,
                    Signature = sig.AttestationSignature?.Signature,
                    SignedAt = ParseSignatureTimestamp(sig.AttestationSignature)
                }).ToList();
            }

            return tokenInfo;
        }
        catch (MetadataServiceException ex)
        {
            _logger.LogError(ex, $"Failed to retrieve token metadata for {subject}");
            throw;
        }
    }
```

**Validation Methods**

The validation method ensures that token subjects conform to Cardano standards before making API calls. This prevents invalid requests and provides immediate feedback for malformed inputs, improving both performance and user experience.

```csharp
    private bool IsValidTokenSubject(string subject)
    {
        // Subject must be between 56 (policy only) and 120 (policy + max asset name) hex chars
        if (string.IsNullOrEmpty(subject) || subject.Length < 56 || subject.Length > 120)
            return false;

        // Must be valid hexadecimal
        return System.Text.RegularExpressions.Regex.IsMatch(subject, "^[0-9a-fA-F]+$");
    }
```

**Subject Parsing Methods**

These utility methods extract the policy ID and asset name components from a token subject. They handle the hexadecimal encoding used in Cardano and attempt to convert asset names to human-readable UTF-8 strings when possible.

```csharp
    private string ExtractPolicyId(string subject)
    {
        return subject.Substring(0, 56);
    }

    private string ExtractAssetName(string subject)
    {
        if (subject.Length <= 56) return string.Empty;
        
        var hexName = subject.Substring(56);
        // Convert hex to UTF-8 string if possible
        try
        {
            var bytes = Convert.FromHexString(hexName);
            return Encoding.UTF8.GetString(bytes);
        }
        catch
        {
            // Return hex if not valid UTF-8
            return hexName;
        }
    }
```

**Metadata Extraction Method**

The ExtractAdditionalMetadata method uses reflection to dynamically extract all available metadata properties from the registry response. This approach ensures forward compatibility as new metadata fields are added to the CIP-26 standard without requiring code changes.

```csharp
    private Dictionary<string, object> ExtractAdditionalMetadata(RegistryItem token)
    {
        var metadata = new Dictionary<string, object>();

        // Extract all available metadata fields
        var properties = token.GetType().GetProperties()
            .Where(p => p.PropertyType.IsGenericType && 
                       p.PropertyType.GetGenericTypeDefinition() == typeof(Property<>));

        foreach (var prop in properties)
        {
            var value = prop.GetValue(token);
            if (value != null)
            {
                var propValue = value.GetType().GetProperty("Value")?.GetValue(value);
                if (propValue != null)
                {
                    metadata[prop.Name] = propValue;
                }
            }
        }

        return metadata;
    }

    private DateTime? ParseSignatureTimestamp(AttestationSignature sig)
    {
        // Implementation depends on your signature format
        // This is a placeholder
        return sig?.Timestamp;
    }
}
```

**Token Display Service**

The TokenDisplayService demonstrates a practical implementation that combines the query service with caching and user interface concerns. It shows how to properly handle errors, implement caching strategies, and present token information to end users.

```csharp
public class TokenDisplayService
{
    private readonly TokenQueryService _queryService;
    private readonly IMemoryCache _cache;

    public async Task DisplayTokenInfo(string subject)
    {
        // Try cache first
        var cacheKey = $"token_{subject}";
        if (_cache.TryGetValue<TokenInfo>(cacheKey, out var cachedToken))
        {
            DisplayToken(cachedToken);
            return;
        }

        try
        {
            var token = await _queryService.GetTokenInfoAsync(subject);
            
            if (token == null)
            {
                Console.WriteLine("Token not found in registry");
                return;
            }

            // Cache for 5 minutes
            _cache.Set(cacheKey, token, TimeSpan.FromMinutes(5));
            
            DisplayToken(token);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine($"Invalid token subject: {ex.Message}");
        }
        catch (MetadataServiceException ex)
        {
            Console.WriteLine($"Failed to retrieve token: {ex.Message}");
        }
    }

    private void DisplayToken(TokenInfo token)
    {
        Console.WriteLine($"=== {token.DisplayName} ===");
        Console.WriteLine($"Ticker: {token.Ticker ?? "N/A"}");
        Console.WriteLine($"Policy ID: {token.PolicyId}");
        Console.WriteLine($"Asset Name: {token.AssetName}");
        Console.WriteLine($"Decimals: {token.Decimals}");
        
        if (!string.IsNullOrEmpty(token.Description))
        {
            Console.WriteLine($"\nDescription: {token.Description}");
        }
        
        if (token.IsVerified)
        {
            Console.WriteLine("\n✓ This token metadata is cryptographically verified");
            Console.WriteLine($"  Signatures: {token.SignatureDetails.Count}");
        }
        
        if (!string.IsNullOrEmpty(token.Url))
        {
            Console.WriteLine($"\nWebsite: {token.Url}");
        }
    }
}
```

**Complete Implementation Summary**

This token query implementation provides a complete solution for retrieving and displaying Cardano token metadata. The TokenQueryService handles the core logic with proper validation and error handling, while the TokenDisplayService demonstrates practical usage with caching and user presentation. Together, they form a robust pattern that can be adapted for wallets, explorers, or any application requiring token information from the COMP service.

---

## NFT Marketplace Integration

### Building an NFT Gallery

Create a complete NFT gallery application that displays collections with metadata, images, and attributes. This implementation demonstrates how to retrieve entire NFT collections, handle various image storage protocols, parse dynamic attributes, and implement rarity calculations. The service includes caching strategies to optimize performance when displaying large collections.

**NFT Gallery Service Class**

The NftGalleryService provides the core functionality for retrieving and processing NFT collections. It integrates with the COMP service to fetch collection data and includes built-in caching to reduce API calls for frequently accessed collections.

```csharp
public class NftGalleryService
{
    private readonly MetadataServiceClient _client;
    private readonly IMemoryCache _cache;

    public NftGalleryService(MetadataServiceClient client, IMemoryCache cache)
    {
        _client = client;
        _cache = cache;
    }
```

**Collection Retrieval Method**

The GetCollectionAsync method fetches all NFTs within a specific policy ID and transforms them into a structured collection object. It handles caching, metadata transformation, and enriches each NFT with resolved image URLs and calculated rarity scores.

```csharp
    public async Task<NftCollection> GetCollectionAsync(string policyId)
    {
        // Check cache first
        if (_cache.TryGetValue($"collection_{policyId}", out NftCollection cached))
        {
            return cached;
        }

        // Fetch from API
        var response = await _client.GetAsync<NftCollectionResponse>(
            $"/api/metadata/nft/policy/{policyId}?includeMetadata=true"
        );

        var collection = new NftCollection
        {
            PolicyId = policyId,
            Name = response.CollectionName,
            Description = response.Description,
            Assets = response.Assets.Select(a => new NftAsset
            {
                Subject = a.Subject,
                Name = a.Metadata?.Name,
                Image = ResolveImageUrl(a.Metadata?.Image),
                Description = a.Metadata?.Description,
                Attributes = ParseAttributes(a.Metadata?.Attributes),
                Rarity = CalculateRarity(a.Metadata?.Attributes)
            }).ToList()
        };

        // Cache for 5 minutes
        _cache.Set($"collection_{policyId}", collection, TimeSpan.FromMinutes(5));
        return collection;
    }
```

**Image URL Resolution**

The ResolveImageUrl method handles different decentralized storage protocols commonly used for NFT images. It converts protocol-specific URIs (IPFS, Arweave) into accessible HTTP URLs that can be displayed in web applications.

```csharp
    private string ResolveImageUrl(string imageUri)
    {
        if (string.IsNullOrEmpty(imageUri)) return null;

        // Handle IPFS URLs
        if (imageUri.StartsWith("ipfs://"))
        {
            var hash = imageUri.Substring(7);
            return $"https://ipfs.io/ipfs/{hash}";
        }

        // Handle Arweave URLs
        if (imageUri.StartsWith("ar://"))
        {
            var id = imageUri.Substring(5);
            return $"https://arweave.net/{id}";
        }

        return imageUri;
    }
```

**Attribute Parsing**

The ParseAttributes method processes dynamic NFT attributes into a strongly-typed dictionary. It handles various JSON value types and ensures attributes are properly extracted regardless of their structure, making them easy to display and filter.

```csharp
    private Dictionary<string, object> ParseAttributes(dynamic attributes)
    {
        var result = new Dictionary<string, object>();
        
        if (attributes != null)
        {
            foreach (var prop in attributes.EnumerateObject())
            {
                result[prop.Name] = prop.Value.ValueKind switch
                {
                    JsonValueKind.String => prop.Value.GetString(),
                    JsonValueKind.Number => prop.Value.GetInt32(),
                    JsonValueKind.True => true,
                    JsonValueKind.False => false,
                    _ => prop.Value.ToString()
                };
            }
        }

        return result;
    }
```

**Rarity Calculation**

The CalculateRarity method implements a basic rarity scoring system based on NFT attributes. This example demonstrates how to analyze attributes and assign rarity tiers, which can be expanded with more sophisticated algorithms based on collection-specific requirements.

```csharp
    private string CalculateRarity(dynamic attributes)
    {
        // Implement rarity calculation based on attribute frequency
        // This is a simplified example
        var score = 0;
        
        if (attributes?.Background == "Rare") score += 50;
        if (attributes?.Special == true) score += 100;
        
        return score switch
        {
            >= 100 => "Legendary",
            >= 50 => "Rare",
            >= 25 => "Uncommon",
            _ => "Common"
        };
    }
}
```

**Gallery Implementation Summary**

This NFT gallery implementation provides a complete solution for displaying Cardano NFT collections. The service efficiently retrieves collection data, resolves images from decentralized storage, parses dynamic attributes, and calculates rarity scores. The caching layer ensures optimal performance even when dealing with large collections, making it suitable for production NFT marketplaces and gallery applications.

### Implementing Metadata Updates

For CIP-68 compliant NFTs with updateable metadata, implement a service to handle metadata modifications. This implementation demonstrates how to validate ownership, prepare update payloads, and interact with the COMP service to modify NFT metadata on-chain. The service ensures data integrity through comprehensive validation before submitting updates.

**Metadata Update Service**

The MetadataUpdateService class provides the infrastructure for updating NFT metadata. It handles the complete update lifecycle from validation through to transaction submission, ensuring only authorized updates are processed.

```csharp
public class MetadataUpdateService
{
    private readonly HttpClient _httpClient;
    
    public MetadataUpdateService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
```

**Update Execution Method**

The UpdateNftMetadata method orchestrates the metadata update process. It validates the request, prepares the update payload with proper structure, and submits it to the COMP service for on-chain processing.

```csharp
    public async Task<UpdateResult> UpdateNftMetadata(
        string policyId, 
        string assetName, 
        NftMetadataUpdate update)
    {
        // Validate the update request
        var validation = await ValidateUpdate(policyId, assetName, update);
        if (!validation.IsValid)
        {
            return new UpdateResult { Success = false, Errors = validation.Errors };
        }

        // Prepare the update payload
        var payload = new
        {
            policyId,
            assetName,
            metadata = new
            {
                name = update.Name,
                description = update.Description,
                image = update.ImageUrl,
                attributes = update.Attributes,
                files = update.AdditionalFiles?.Select(f => new
                {
                    name = f.Name,
                    mediaType = f.MediaType,
                    src = f.Url
                })
            },
            signature = update.OwnerSignature
        };

        // Send update request
        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync("/api/metadata/nft/update", content);
        
        if (response.IsSuccessStatusCode)
        {
            return new UpdateResult { Success = true, TransactionHash = await response.Content.ReadAsStringAsync() };
        }

        return new UpdateResult 
        { 
            Success = false, 
            Errors = new[] { $"Update failed: {response.StatusCode}" } 
        };
    }
```

**Validation Logic**

The ValidateUpdate method ensures all update requests meet CIP-68 requirements and ownership criteria. It performs comprehensive checks on field lengths, required properties, and ownership verification to prevent invalid or unauthorized updates.

```csharp
    private async Task<ValidationResult> ValidateUpdate(
        string policyId, 
        string assetName, 
        NftMetadataUpdate update)
    {
        var errors = new List<string>();

        // Check ownership
        if (!await VerifyOwnership(policyId, assetName, update.OwnerSignature))
        {
            errors.Add("Invalid ownership signature");
        }

        // Validate required fields
        if (string.IsNullOrEmpty(update.Name))
        {
            errors.Add("Name is required");
        }

        if (update.Name?.Length > 64)
        {
            errors.Add("Name exceeds 64 byte limit");
        }

        // Validate image URL
        if (!string.IsNullOrEmpty(update.ImageUrl))
        {
            if (!IsValidImageUrl(update.ImageUrl))
            {
                errors.Add("Invalid image URL format");
            }
        }

        return new ValidationResult 
        { 
            IsValid = errors.Count == 0, 
            Errors = errors 
        };
    }
}
```

**Metadata Update Summary**

This metadata update implementation provides a secure and validated approach to modifying CIP-68 NFT metadata. The service ensures only authorized owners can update their NFTs through signature verification, validates all metadata fields against protocol requirements, and provides clear error messages for failed updates. This pattern can be extended with additional validation rules and custom metadata fields based on specific collection requirements.

---

## Token Registry Implementation

### Building a DEX Token List

Create a decentralized exchange (DEX) token registry that provides verified token information for trading interfaces. This implementation demonstrates how to build a comprehensive token list suitable for DEX applications, including filtering, caching, and automatic tag generation. The service ensures traders have access to accurate and up-to-date token information for safe trading operations.

**DEX Token Registry Service**

The DexTokenRegistry class provides specialized functionality for retrieving and formatting token data for trading interfaces. It includes distributed caching for scalability and supports filtering by policies to create custom token lists for specific trading pairs or markets.

```csharp
public class DexTokenRegistry
{
    private readonly MetadataServiceClient _client;
    private readonly IDistributedCache _cache;
    private readonly ILogger<DexTokenRegistry> _logger;

    public DexTokenRegistry(MetadataServiceClient client, 
                           IDistributedCache cache, 
                           ILogger<DexTokenRegistry> logger)
    {
        _client = client;
        _cache = cache;
        _logger = logger;
    }
```

**Token List Retrieval Method**

The GetVerifiedTokensAsync method builds comprehensive token lists with pagination support and policy filtering. It transforms raw metadata into a DEX-friendly format that includes all necessary trading information while maintaining compatibility with common DEX standards.

```csharp
    public async Task<DexTokenList> GetVerifiedTokensAsync(
        int limit = 100, 
        int offset = 0,
        string[] includePolicies = null)
    {
        var cacheKey = $"dex_tokens_{limit}_{offset}_{string.Join(",", includePolicies ?? Array.Empty<string>())}";
        
        // Try cache first
        var cached = await _cache.GetStringAsync(cacheKey);
        if (!string.IsNullOrEmpty(cached))
        {
            return JsonSerializer.Deserialize<DexTokenList>(cached);
        }

        // Build query parameters
        var queryParams = new List<string>
        {
            $"limit={limit}",
            $"offset={offset}",
            "verified=true"
        };

        if (includePolicies?.Length > 0)
        {
            queryParams.Add($"policies={string.Join(",", includePolicies)}");
        }

        // Fetch from API
        var response = await _client.GetAsync<List<RegistryItem>>(
            $"/api/metadata/tokens?{string.Join("&", queryParams)}"
        );

        // Transform to DEX format
        var dexTokens = new DexTokenList
        {
            Name = "Verified Cardano Tokens",
            Version = "1.0.0",
            Timestamp = DateTime.UtcNow,
            Tokens = response.Select(item => new DexToken
            {
                Subject = item.Subject,
                PolicyId = ExtractPolicyId(item.Subject),
                AssetName = ExtractAssetName(item.Subject),
                Symbol = item.Ticker?.Value ?? "???",
                Name = item.Name?.Value ?? "Unknown Token",
                Decimals = item.Decimals?.Value ?? 0,
                LogoUri = item.Logo?.Value,
                Verified = item.Name?.Signatures?.Any() == true,
                Tags = GenerateTags(item),
                Extensions = new
                {
                    website = item.Url?.Value,
                    description = item.Description?.Value
                }
            }).ToList()
        };

        // Cache for 15 minutes
        await _cache.SetStringAsync(
            cacheKey, 
            JsonSerializer.Serialize(dexTokens),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
            }
        );

        return dexTokens;
    }
```

**Tag Generation System**

The GenerateTags method automatically categorizes tokens based on their metadata properties. This tagging system helps DEX interfaces filter and display tokens appropriately, improving user experience by highlighting important token characteristics.

```csharp
    private string[] GenerateTags(RegistryItem item)
    {
        var tags = new List<string>();

        // Add standard tags
        if (item.Decimals?.Value == 0) tags.Add("nft");
        else tags.Add("fungible");

        if (item.Name?.Signatures?.Any() == true) tags.Add("verified");
        if (!string.IsNullOrEmpty(item.Logo?.Value)) tags.Add("has-logo");

        // Add custom tags based on metadata
        if (item.Description?.Value?.Contains("stablecoin", StringComparison.OrdinalIgnoreCase) == true)
        {
            tags.Add("stablecoin");
        }

        return tags.ToArray();
    }
```

**Subject Parsing Utilities**

These utility methods extract policy IDs and asset names from token subjects for separate display in trading interfaces. They handle the hexadecimal format used in Cardano and ensure consistent parsing across different token types.

```csharp
    private string ExtractPolicyId(string subject)
    {
        // Subject format: policyId + assetName (hex)
        return subject?.Length >= 56 ? subject.Substring(0, 56) : null;
    }

    private string ExtractAssetName(string subject)
    {
        // Extract asset name from subject
        return subject?.Length > 56 ? subject.Substring(56) : "";
    }
}
```

**DEX Registry Implementation Summary**

This DEX token registry implementation provides everything needed to integrate verified token lists into trading applications. The service retrieves only verified tokens, transforms metadata into DEX-compatible formats, and implements intelligent caching to handle high-frequency queries. The automatic tagging system and extensible structure make it easy to adapt for specific DEX requirements while maintaining compatibility with industry standards.

---

## Advanced Querying

### Complex Metadata Search

Implement advanced search functionality with filtering, sorting, and full-text search capabilities. This implementation provides comprehensive search capabilities for token metadata, including faceted search results, similarity matching, and performance optimization through caching. The service enables building sophisticated search interfaces for token explorers and discovery platforms.

**Metadata Search Service**

The MetadataSearchService class provides powerful search capabilities for querying token metadata. It supports full-text search, multi-faceted filtering, and includes caching to optimize repeated searches with similar parameters.

```csharp
public class MetadataSearchService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    public MetadataSearchService(HttpClient httpClient, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _cache = cache;
    }
```

**Advanced Token Search Method**

The SearchTokensAsync method implements comprehensive search functionality with support for text queries, multiple filter types, sorting, and pagination. It returns rich results including faceted counts that enable building dynamic filter interfaces.

```csharp
    public async Task<SearchResult<TokenMetadata>> SearchTokensAsync(SearchQuery query)
    {
        // Build search request
        var searchRequest = new
        {
            q = query.SearchTerm,
            filters = new
            {
                policies = query.PolicyFilters,
                decimals = query.DecimalFilters,
                hasLogo = query.RequireLogo,
                verified = query.VerifiedOnly
            },
            sort = new
            {
                field = query.SortBy ?? "name",
                order = query.SortOrder ?? "asc"
            },
            pagination = new
            {
                page = query.Page,
                limit = query.PageSize
            },
            facets = new[] { "policy", "decimals", "verified" }
        };

        var json = JsonSerializer.Serialize(searchRequest);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        var response = await _httpClient.PostAsync("/api/metadata/search", content);
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadFromJsonAsync<SearchResponse>();
        
        return new SearchResult<TokenMetadata>
        {
            Items = result.Results.Select(r => new TokenMetadata(
                Subject: r.Subject,
                Name: r.Name,
                Ticker: r.Ticker,
                PolicyId: r.PolicyId,
                Decimals: r.Decimals,
                Policy: r.Policy,
                Url: r.Url,
                Logo: r.Logo,
                Description: r.Description
            )).ToList(),
            TotalCount = result.TotalCount,
            Page = query.Page,
            PageSize = query.PageSize,
            Facets = TransformFacets(result.Facets),
            SearchTime = result.SearchTimeMs
        };
    }
```

**Similarity Search Method**

The GetSimilarTokensAsync method leverages ML-powered similarity matching to find tokens related to a given subject. This feature enables recommendation systems and helps users discover related tokens based on metadata similarities.

```csharp
    public async Task<List<TokenMetadata>> GetSimilarTokensAsync(string subject, int limit = 10)
    {
        // Use ML-powered similarity search
        var response = await _httpClient.GetAsync(
            $"/api/metadata/similar/{subject}?limit={limit}"
        );
        
        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<List<TokenMetadata>>();
    }
```

**Facet Transformation**

The TransformFacets method processes search result facets into a structured format suitable for building dynamic filter interfaces. It extracts counts for each facet value, enabling users to see how many results match each filter option.

```csharp
    private Dictionary<string, List<FacetValue>> TransformFacets(dynamic facets)
    {
        var result = new Dictionary<string, List<FacetValue>>();
        
        foreach (var facet in facets.EnumerateObject())
        {
            var values = new List<FacetValue>();
            
            foreach (var value in facet.Value.EnumerateArray())
            {
                values.Add(new FacetValue
                {
                    Value = value.GetProperty("value").GetString(),
                    Count = value.GetProperty("count").GetInt32()
                });
            }
            
            result[facet.Name] = values;
        }
        
        return result;
    }
}
```

**Search Implementation Example**

This example demonstrates how to use the search service with various filters and display the results including faceted counts. It shows a practical implementation suitable for token discovery interfaces.

```csharp
public async Task SearchExample()
{
    var searchService = new MetadataSearchService();
    
    var query = new SearchQuery
    {
        SearchTerm = "NFT",
        PolicyFilters = new[] { "policy1", "policy2" },
        DecimalFilters = new[] { 0 }, // NFTs only
        RequireLogo = true,
        VerifiedOnly = true,
        SortBy = "name",
        SortOrder = "asc",
        Page = 1,
        PageSize = 20
    };
    
    var results = await searchService.SearchTokensAsync(query);
    
    Console.WriteLine($"Found {results.TotalCount} tokens in {results.SearchTime}ms");
    
    // Display facets
    foreach (var facet in results.Facets)
    {
        Console.WriteLine($"\n{facet.Key}:");
        foreach (var value in facet.Value)
        {
            Console.WriteLine($"  {value.Value}: {value.Count}");
        }
    }
}
```

**Advanced Querying Summary**

This advanced querying implementation enables building sophisticated token discovery and search interfaces. The combination of full-text search, multi-faceted filtering, and similarity matching provides users with powerful tools to find and explore tokens. The faceted results support dynamic filter interfaces that adapt based on search results, while the similarity search enables recommendation features. These capabilities make it suitable for building comprehensive token explorers, marketplace search engines, and discovery platforms.

---

These examples demonstrate various integration patterns and best practices for working with the Cardano.Metadata service. Each example is production-ready and can be adapted to your specific requirements. For additional examples and advanced scenarios, refer to the [API Reference](./api-reference) section.