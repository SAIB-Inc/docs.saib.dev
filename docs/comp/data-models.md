---
sidebar_position: 3
title: Data Models
---

# Data Models

The Cardano.Metadata service uses specific data models for managing and serving Cardano token metadata. These models support the metadata registry functionality and API responses.

---

## Entity Models

### TokenMetadata

The core model representing token metadata stored in the database, designed to support both fungible tokens and NFTs within the Cardano ecosystem. This record serves as the foundation for the metadata registry, enabling efficient storage and retrieval of token information across different applications and marketplaces.

```csharp
public record TokenMetadata
(
    string Subject,
    string Name,
    string Ticker,
    string PolicyId,
    int Decimals,
    string? Policy,
    string? Url,
    string? Logo,
    string? Description
);
```

**Field Specifications:**

- **Subject** (required): The unique identifier for the token, typically composed of policy ID + asset name in hex format. This serves as the primary key for database operations and follows the Cardano token identification standard.

- **Name** (required): Human-readable display name of the token as it appears in wallets and applications. Must be user-friendly and descriptive, supporting UTF-8 encoding for international characters.

- **Ticker** (required): Trading symbol or abbreviated identifier used in exchanges and trading interfaces. Typically 3-6 characters, following financial market conventions for asset symbols.

- **PolicyId** (required): The 56-character hexadecimal Cardano policy ID that governs the token's minting and burning rules. This links the metadata to the on-chain token policy and enables verification of authenticity.

- **Decimals** (required): Number of decimal places supported by the token for fractional representation. Most ADA-based tokens use 6 decimals to match ADA's precision, while NFTs typically use 0.

- **Policy** (optional): Additional policy information or metadata about the token's governance rules, smart contract details, or minting constraints. Can include policy script hashes or human-readable policy descriptions.

- **Url** (optional): Official project website, documentation, or resource URL providing more information about the token. Should be a valid HTTP/HTTPS URL pointing to authoritative token information.

- **Logo** (optional): Token logo URL or base64-encoded image data for display in wallets and applications. Supports standard image formats (PNG, JPG, SVG) with recommended dimensions of 256x256 pixels.

- **Description** (optional): Detailed explanation of the token's purpose, utility, and project background. Supports markdown formatting and should provide comprehensive information for users and developers.

**Usage Examples:**
```csharp
// Fungible token metadata
var adaHandleToken = new TokenMetadata(
    Subject: "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a000de140",
    Name: "ADA Handle",
    Ticker: "HANDLE",
    PolicyId: "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a",
    Decimals: 0,
    Policy: "NFT policy for personalized ADA addresses",
    Url: "https://adahandle.com",
    Logo: "https://adahandle.com/logo.png",
    Description: "Personalized addresses for the Cardano blockchain"
);

// NFT collection metadata
var nftMetadata = new TokenMetadata(
    Subject: "abc123...def456",
    Name: "CryptoPunk #1234",
    Ticker: "PUNK",
    PolicyId: "abc123def456...",
    Decimals: 0,
    Policy: "Limited edition NFT collection",
    Url: "https://cryptopunks-cardano.io",
    Logo: "ipfs://QmNFTLogo123...",
    Description: "Unique collectible avatar from the CryptoPunks collection"
);
```

### SyncState

Tracks synchronization state for metadata updates, ensuring data consistency and enabling efficient incremental updates from external sources. This model is critical for maintaining up-to-date metadata information while minimizing unnecessary processing and network overhead.

```csharp
public record SyncState
(
    string Hash,
    DateTimeOffset Date
);
```

**Synchronization Management:**

- **Hash** (required): Current state hash representing the metadata snapshot at the time of synchronization. This is typically a SHA-256 hash of the combined metadata content, enabling quick comparison to detect changes without processing entire datasets. The hash serves as a fingerprint for the current state and helps prevent duplicate processing of unchanged data.

- **Date** (required): UTC timestamp of the last successful synchronization operation. This enables tracking of sync frequency, debugging synchronization issues, and implementing retry logic for failed updates. The DateTimeOffset type preserves timezone information for accurate temporal tracking across different deployment environments.

**Implementation Features:**
- **Change Detection**: Hash comparison enables efficient detection of metadata updates
- **Incremental Sync**: Only processes changes since the last successful synchronization
- **Audit Trail**: Maintains historical record of synchronization operations
- **Error Recovery**: Supports rollback to previous known good states

**Usage in Synchronization Workflow:**
```csharp
// Check if synchronization is needed
var currentState = await GetCurrentSyncState();
var remoteHash = await GetRemoteMetadataHash();

if (currentState?.Hash != remoteHash)
{
    // Perform synchronization
    await SynchronizeMetadata();
    
    // Update sync state
    var newState = new SyncState(
        Hash: remoteHash,
        Date: DateTimeOffset.UtcNow
    );
    await SaveSyncState(newState);
}
```

---

## Response Models

### RegistryItem

The API response model for registry queries, designed to provide comprehensive token information while supporting versioning, validation, and cryptographic verification. This model serves as the primary interface between the metadata service and external applications, ensuring data integrity and traceability.

```csharp
public record RegistryItem
{
    public string? Subject { get; init; }
    public ValueResponse<string>? Policy { get; init; }
    public ValueResponse<int>? Decimals { get; init; }
    public ValueResponse<string>? Description { get; init; }
    public ValueResponse<string>? Name { get; init; }
    public ValueResponse<string>? Ticker { get; init; }
    public ValueResponse<string>? Url { get; init; }
    public ValueResponse<string>? Logo { get; init; }
}
```

**Response Model Features:**

- **Subject**: The unique token identifier that serves as the lookup key for registry queries. This field is always present and enables client applications to verify they received the correct token information.

- **Wrapped Values**: All metadata fields are wrapped in `ValueResponse<T>` containers that provide additional context including version tracking, cryptographic signatures, and data provenance information.

- **Nullable Design**: Optional fields use nullable types to clearly indicate when specific metadata is not available, preventing ambiguous empty string values.

- **API Flexibility**: The structure supports partial responses, allowing efficient queries for specific metadata fields without retrieving complete token information.

**Response Processing Example:**
```csharp
// Query registry for specific token
var registryItem = await metadataService.GetTokenBySubject(tokenSubject);

if (registryItem?.Name?.Value != null)
{
    var tokenName = registryItem.Name.Value;
    var nameVersion = registryItem.Name.SequenceNumber;
    var isVerified = registryItem.Name.Signatures?.Any() == true;
    
    // Use verified token name in application
    DisplayTokenInfo(tokenName, isVerified);
}
```

**Integration Considerations:**
- **Versioning Support**: Sequence numbers enable clients to detect metadata updates
- **Signature Verification**: Optional cryptographic signatures ensure data authenticity
- **Caching Strategy**: Structured format supports efficient client-side caching
- **Error Handling**: Nullable fields enable graceful handling of incomplete data

### ValueResponse

A generic wrapper for API response values that provides comprehensive metadata tracking, versioning, and cryptographic verification capabilities. This wrapper ensures data integrity and enables sophisticated client-side caching and validation strategies.

```csharp
public record ValueResponse<T>
{
    public T Value { get; init; }
    public int SequenceNumber { get; init; }
    public List<Signature>? Signatures { get; init; }
}
```

**Wrapper Components:**

- **Value** (required): The actual data payload of type T, containing the requested metadata information. This strongly-typed field ensures compile-time safety and eliminates casting errors in client applications.

- **SequenceNumber** (required): Monotonically increasing version identifier that tracks changes to the specific metadata field. Enables efficient client-side caching by allowing applications to detect when cached data becomes stale and requires refreshing.

- **Signatures** (optional): Collection of cryptographic signatures that verify the authenticity and integrity of the metadata value. Each signature includes the signer's public key, signature algorithm, and signature data, enabling clients to verify the data hasn't been tampered with.

**Advanced Features:**

**Version Management:**
```csharp
// Compare versions to detect updates
var cachedResponse = GetCachedValue("token-name");
var currentResponse = await GetCurrentValue("token-name");

if (currentResponse.SequenceNumber > cachedResponse.SequenceNumber)
{
    // Update cache with newer version
    UpdateCache("token-name", currentResponse);
}
```

**Signature Verification:**
```csharp
// Verify data authenticity
public bool VerifyValueResponse<T>(ValueResponse<T> response, PublicKey trustedKey)
{
    if (response.Signatures == null) return false;
    
    foreach (var signature in response.Signatures)
    {
        var dataHash = ComputeHash(response.Value);
        if (VerifySignature(dataHash, signature, trustedKey))
        {
            return true; // At least one valid signature found
        }
    }
    
    return false;
}
```

**Caching Strategy:**
```csharp
// Implement intelligent caching based on sequence numbers
public class MetadataCacheService
{
    private readonly Dictionary<string, ValueResponse<object>> _cache = new();
    
    public async Task<ValueResponse<T>> GetWithCache<T>(string key)
    {
        // Check cache first
        if (_cache.TryGetValue(key, out var cached))
        {
            var current = await FetchFromApi<T>(key);
            
            // Return cached if still current
            if (current.SequenceNumber == cached.SequenceNumber)
            {
                return (ValueResponse<T>)cached;
            }
            
            // Update cache with newer version
            _cache[key] = current;
            return current;
        }
        
        // First time fetch
        var response = await FetchFromApi<T>(key);
        _cache[key] = response;
        return response;
    }
}
```

---

## GitHub Integration Models

The service integrates with GitHub for decentralized metadata storage and version-controlled updates, enabling community-driven metadata management while maintaining data integrity and audit trails. This integration supports the Cardano Token Registry model where metadata submissions and updates are managed through GitHub workflows.

**Integration Capabilities:**

**Repository Management:**
- **Metadata Storage**: Token metadata files organized in standardized directory structures within GitHub repositories
- **Version Control**: Full git history tracking for all metadata changes, enabling rollback and audit capabilities
- **Branch Protection**: Support for protected branches and required reviews for metadata submissions
- **Automated Validation**: GitHub Actions integration for validating metadata format and content before merge

**Pull Request Processing:**
- **Submission Workflow**: New token registrations submitted via pull requests with automated validation
- **Review Process**: Human and automated review of metadata submissions for accuracy and compliance
- **Conflict Resolution**: Merge conflict handling for concurrent metadata updates
- **Status Tracking**: Real-time synchronization status updates between GitHub and the metadata service

**File Structure Management:**
- **Standardized Layout**: Enforced directory structure for consistent metadata organization
- **Multi-Format Support**: JSON, YAML, and other metadata file formats with automatic conversion
- **Asset Management**: Support for metadata assets like logos and images stored alongside metadata files
- **Batch Operations**: Efficient processing of multiple metadata files in single pull requests

**Synchronization Architecture:**
```csharp
// Simplified representation of GitHub integration workflow
public class GitHubSyncService
{
    public async Task<SyncResult> SynchronizeRepository(string repoUrl)
    {
        // 1. Fetch latest commit hash
        var latestCommit = await GetLatestCommitHash(repoUrl);
        var currentState = await GetSyncState(repoUrl);
        
        // 2. Check if sync needed
        if (currentState?.Hash == latestCommit) 
        {
            return SyncResult.NoChanges();
        }
        
        // 3. Process changes since last sync
        var changes = await GetChangesSince(repoUrl, currentState?.Hash);
        var results = await ProcessMetadataChanges(changes);
        
        // 4. Update sync state
        await UpdateSyncState(repoUrl, latestCommit);
        
        return results;
    }
    
    private async Task<ProcessingResult> ProcessMetadataChanges(IEnumerable<FileChange> changes)
    {
        var results = new List<TokenMetadata>();
        
        foreach (var change in changes)
        {
            if (IsMetadataFile(change.FilePath))
            {
                var metadata = await ParseMetadataFile(change.Content);
                var validated = await ValidateMetadata(metadata);
                
                if (validated.IsValid)
                {
                    results.Add(metadata);
                }
            }
        }
        
        return new ProcessingResult(results);
    }
}
```

**Security and Validation:**
- **Cryptographic Verification**: GitHub commit signatures provide authenticity verification
- **Access Control**: Repository permissions and branch protection rules enforce submission policies
- **Content Validation**: Automated validation of metadata format, required fields, and data integrity
- **Rate Limiting**: GitHub API rate limiting considerations for high-frequency sync operations

---

## Database Schema

The models map to a comprehensive PostgreSQL database schema managed through Entity Framework Core, designed for high-performance queries, data integrity, and scalable metadata storage. The schema supports efficient lookups, full-text search, and maintains referential integrity across related entities.

**Table Structure:**

**TokenMetadata Table:**
- **Primary Key**: Subject (string, unique identifier)
- **Indexes**: PolicyId (B-tree), Name (GIN for full-text search), Ticker (B-tree)
- **Constraints**: NOT NULL on required fields (Subject, Name, Ticker, PolicyId, Decimals)
- **Storage**: Optimized for frequent reads with minimal write overhead

**SyncState Table:**
- **Primary Key**: Composite key (Source, Repository) for multi-source support
- **Indexes**: Date (B-tree) for temporal queries, Hash (B-tree) for quick lookups
- **Constraints**: Unique constraint on Hash to prevent duplicate states
- **Partitioning**: Date-based partitioning for efficient historical data management

**Advanced Schema Features:**

**Performance Optimizations:**
```sql
-- Optimized indexes for common query patterns
CREATE INDEX CONCURRENTLY idx_tokenmetadata_policyid_btree 
ON TokenMetadata USING btree (PolicyId);

CREATE INDEX CONCURRENTLY idx_tokenmetadata_name_gin 
ON TokenMetadata USING gin (to_tsvector('english', Name));

CREATE INDEX CONCURRENTLY idx_tokenmetadata_composite 
ON TokenMetadata (PolicyId, Name) 
WHERE Description IS NOT NULL;

-- Partial index for active tokens
CREATE INDEX CONCURRENTLY idx_tokenmetadata_active 
ON TokenMetadata (Subject, Name) 
WHERE Url IS NOT NULL AND Logo IS NOT NULL;
```

**Migration Management:**
```csharp
// Entity Framework Core migration example
public partial class AddTokenMetadataIndexes : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Add performance indexes
        migrationBuilder.Sql(@"
            CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tokenmetadata_search 
            ON ""TokenMetadata"" USING gin (
                to_tsvector('english', ""Name"" || ' ' || COALESCE(""Description"", ''))
            );
        ");
        
        // Add constraint for valid policy IDs
        migrationBuilder.Sql(@"
            ALTER TABLE ""TokenMetadata"" 
            ADD CONSTRAINT chk_policyid_format 
            CHECK (char_length(""PolicyId"") = 56 AND ""PolicyId"" ~ '^[a-fA-F0-9]+$');
        ");
    }
    
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex("idx_tokenmetadata_search");
        migrationBuilder.DropCheckConstraint("TokenMetadata", "chk_policyid_format");
    }
}
```

**Query Optimization Patterns:**
```sql
-- Efficient policy-based queries
SELECT Subject, Name, Ticker, Logo 
FROM TokenMetadata 
WHERE PolicyId = $1 
ORDER BY Name 
LIMIT 100;

-- Full-text search across name and description
SELECT Subject, Name, ts_rank(search_vector, query) as rank
FROM TokenMetadata, plainto_tsquery('english', $1) query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 50;

-- Complex filtering with proper index usage
SELECT t.Subject, t.Name, t.Logo, s.Date as LastUpdated
FROM TokenMetadata t
LEFT JOIN SyncState s ON s.Hash = encode(sha256(t.Subject::bytea), 'hex')
WHERE t.PolicyId = ANY($1)
AND t.Decimals > 0
AND t.Url IS NOT NULL
ORDER BY s.Date DESC NULLS LAST;
```

**Scalability Considerations:**
- **Connection Pooling**: Optimized connection pool sizing for high-concurrency scenarios
- **Read Replicas**: Support for read-only replicas to distribute query load
- **Partitioning**: Table partitioning strategies for handling large-scale metadata collections
- **Archival**: Automated archival of historical sync states to maintain performance

---

## Usage Context

These models serve different purposes within the Cardano.Metadata service:

1. **Storage**: `TokenMetadata` and `SyncState` persist data in PostgreSQL
2. **API Responses**: `RegistryItem` and `ValueResponse` structure API outputs
3. **Synchronization**: Models support the GitHub worker that syncs metadata
4. **Querying**: Enable efficient lookups by subject, policy ID, or other properties

The service acts as a metadata registry, providing a centralized source for Cardano token information that can be queried through its API endpoints.