---
title: Use Cases
sidebar_position: 2
---

# Use Cases

Learn how to interact with the Cardano.Metadata service through practical use cases. These use cases demonstrate common API usage patterns and real-world integration scenarios. Each use case provides working C# code that you can adapt to your specific needs, covering everything from simple queries to complex metadata operations. The examples use standard HTTP client calls to interact with the COMP service API endpoints.

---

## Querying Metadata

### Get Metadata by Transaction Hash

Retrieve metadata for a specific transaction. This endpoint returns all metadata entries associated with a single transaction, which can include multiple labels and data types. The response provides a dictionary structure where keys represent metadata labels and values contain the corresponding metadata content:

```csharp
using System.Net.Http;
using System.Text.Json;

var httpClient = new HttpClient { BaseAddress = new Uri("http://localhost:5000") };

// Get metadata for a specific transaction
var transactionHash = "abc123def456789...";
var response = await httpClient.GetAsync($"/api/metadata/transaction/{transactionHash}");
response.EnsureSuccessStatusCode();

var content = await response.Content.ReadAsStringAsync();
var metadata = JsonSerializer.Deserialize<Dictionary<string, object>>(content);

Console.WriteLine($"Found {metadata.Count} metadata entries");
foreach (var entry in metadata)
{
    Console.WriteLine($"Key: {entry.Key}, Value: {entry.Value}");
}
```

### Query Metadata by Label

Search for metadata entries by specific labels. Labels are numeric identifiers that categorize different types of metadata on Cardano, with standardized labels defined by various CIPs (Cardano Improvement Proposals). This query method allows you to filter metadata across all transactions to find entries of a specific type:

**Query CIP-25 NFT metadata (label 721):**
```csharp
var nftResponse = await httpClient.GetAsync("/api/metadata/label/721?limit=10");
nftResponse.EnsureSuccessStatusCode();
var nftContent = await nftResponse.Content.ReadAsStringAsync();
var nftMetadata = JsonSerializer.Deserialize<List<NftMetadataEntry>>(nftContent);

foreach (var nft in nftMetadata)
{
    Console.WriteLine($"NFT: {nft.Name} - {nft.Description}");
}
```

**Query transaction messages (label 674):**
```csharp
var msgResponse = await httpClient.GetAsync("/api/metadata/label/674?limit=20");
msgResponse.EnsureSuccessStatusCode();
var msgContent = await msgResponse.Content.ReadAsStringAsync();
var messages = JsonSerializer.Deserialize<List<MessageEntry>>(msgContent);
```

---

## Working with NFT Metadata

### Retrieve NFT Collection

Get all NFTs from a specific policy. A policy ID represents a minting policy on Cardano and groups related NFTs together as a collection. This endpoint returns comprehensive information about all assets minted under the specified policy, including their metadata attributes and current state:

```csharp
var policyId = "abc123def456...";
var response = await httpClient.GetAsync($"/api/metadata/nft/policy/{policyId}");
response.EnsureSuccessStatusCode();

var content = await response.Content.ReadAsStringAsync();
var collection = JsonSerializer.Deserialize<NftCollection>(content);

Console.WriteLine($"Policy: {collection.PolicyId}");
Console.WriteLine($"Total Assets: {collection.Assets.Count}");

foreach (var asset in collection.Assets)
{
    Console.WriteLine($"Asset: {asset.Name}");
    Console.WriteLine($"  Description: {asset.Description}");
    Console.WriteLine($"  Image: {asset.Image}");
    
    if (asset.Attributes?.Any() == true)
    {
        Console.WriteLine("  Attributes:");
        foreach (var attr in asset.Attributes)
        {
            Console.WriteLine($"    {attr.Key}: {attr.Value}");
        }
    }
}
```

### Validate NFT Metadata

Check if NFT metadata follows CIP-25 standards. CIP-25 defines the standard structure for NFT metadata on Cardano, ensuring compatibility across wallets and marketplaces. This validation endpoint checks your metadata against the standard requirements and provides detailed error messages for any compliance issues:

```csharp
var validationRequest = new NftValidationRequest
{
    PolicyId = "abc123...",
    AssetName = "MyNFT001",
    Metadata = nftMetadataJson
};

var json = JsonSerializer.Serialize(validationRequest);
var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

var response = await httpClient.PostAsync("/api/metadata/nft/validate", content);
response.EnsureSuccessStatusCode();

var responseContent = await response.Content.ReadAsStringAsync();
var validationResult = JsonSerializer.Deserialize<NftValidationResponse>(responseContent);

if (validationResult.IsValid)
{
    Console.WriteLine("NFT metadata is CIP-25 compliant");
}
else
{
    Console.WriteLine("Validation errors:");
    foreach (var error in validationResult.Errors)
    {
        Console.WriteLine($"  - {error}");
    }
}
```

---

## GitHub Integration Examples

### Sync Metadata from Repository

Trigger synchronization from a GitHub repository. This feature enables you to maintain metadata definitions in version control and automatically sync them to the COMP service. The sync process validates all metadata files in the specified repository path and imports them into the database:

```csharp
var syncRequest = new GitHubSyncRequest
{
    Repository = "owner/metadata-repo",
    Branch = "main",
    Path = "metadata/nfts"
};

var json = JsonSerializer.Serialize(syncRequest);
var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

var response = await httpClient.PostAsync("/api/github/sync", content);
response.EnsureSuccessStatusCode();

var responseContent = await response.Content.ReadAsStringAsync();
var syncResult = JsonSerializer.Deserialize<GitHubSyncResponse>(responseContent);

Console.WriteLine($"Sync job started: {syncResult.JobId}");
Console.WriteLine($"Status: {syncResult.Status}");
```

### Check Sync Status

Monitor the progress of a GitHub sync operation. Sync operations run asynchronously and this endpoint provides real-time status updates on the import process. You can track the number of files processed, identify any errors, and determine when the sync is complete:

```csharp
var jobId = "sync-job-123";
var response = await httpClient.GetAsync($"/api/github/sync/{jobId}/status");
response.EnsureSuccessStatusCode();

var content = await response.Content.ReadAsStringAsync();
var status = JsonSerializer.Deserialize<GitHubSyncStatus>(content);

Console.WriteLine($"Job Status: {status.Status}");
Console.WriteLine($"Progress: {status.ProcessedFiles}/{status.TotalFiles}");

if (status.Errors?.Any() == true)
{
    Console.WriteLine("Errors:");
    foreach (var error in status.Errors)
    {
        Console.WriteLine($"  - {error}");
    }
}
```

---

## Database Operations

### Bulk Insert Metadata

Insert multiple metadata entries in a single operation. This endpoint is optimized for importing large volumes of metadata efficiently, such as when migrating from another system or processing historical data. The bulk insert validates each entry and provides detailed results on successful insertions and any failures:

```csharp
var bulkInsert = new BulkMetadataInsert
{
    Entries = new List<MetadataEntry>
    {
        new MetadataEntry
        {
            TransactionHash = "tx1...",
            Label = 674,
            JsonData = """{"message": "Hello Cardano"}""",
            Timestamp = DateTime.UtcNow
        },
        new MetadataEntry
        {
            TransactionHash = "tx2...",
            Label = 721,
            JsonData = """{"policy": "abc123", "assets": {...}}""",
            Timestamp = DateTime.UtcNow
        }
    }
};

var json = JsonSerializer.Serialize(bulkInsert);
var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

var response = await httpClient.PostAsync("/api/metadata/bulk", content);
response.EnsureSuccessStatusCode();

var responseContent = await response.Content.ReadAsStringAsync();
var insertResult = JsonSerializer.Deserialize<BulkInsertResponse>(responseContent);

Console.WriteLine($"Inserted {insertResult.SuccessfulInserts} entries");
```

### Export Metadata

Export metadata in various formats for analysis or backup purposes. The export functionality supports multiple output formats including JSON for data processing and CSV for spreadsheet analysis. You can filter exports by date range, specific labels, or other criteria to create targeted data extracts:

**Export to JSON format:**
```csharp
var jsonResponse = await httpClient.GetAsync("/api/metadata/export?format=json&startDate=2024-01-01&endDate=2024-12-31");
jsonResponse.EnsureSuccessStatusCode();
var jsonExport = await jsonResponse.Content.ReadAsByteArrayAsync();

await File.WriteAllBytesAsync("metadata-export.json", jsonExport);
```

**Export to CSV format:**
```csharp
var csvResponse = await httpClient.GetAsync("/api/metadata/export?format=csv&labels=721,674");
csvResponse.EnsureSuccessStatusCode();
var csvExport = await csvResponse.Content.ReadAsByteArrayAsync();

await File.WriteAllBytesAsync("metadata-export.csv", csvExport);
```

These use cases demonstrate common integration patterns with the Cardano.Metadata service. For complete API documentation, explore the [API Reference](../api-reference) section.