---
sidebar_position: 5
title: API Reference
---

# API Reference

The Cardano.Metadata service provides a comprehensive REST API for querying and managing Cardano token metadata. This reference documents all available endpoints, request/response formats, authentication requirements, and usage examples. The API follows RESTful principles and returns JSON-formatted responses for all operations.

---

## Token Metadata Endpoints

### Get Token by Subject

Retrieve metadata for a specific token using its subject identifier. This endpoint provides access to token metadata properties that follow the Cardano Token Registry format, where each property includes its value and a sequence number for version tracking. The subject identifier combines the policy ID and asset name in hexadecimal format, creating a unique reference for each token on the Cardano blockchain.

**Endpoint:** `GET /metadata/token/{subject}`

**Parameters:**
- **Subject** (required): The unique identifier for the token, typically composed of policy ID + asset name in hex format. This serves as the primary key for database operations and follows the Cardano token identification standard.

**Response:**
```json
{
  "data": {
    "subject": "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a424c41434b",
    "name": {
      "value": "Example Token"
    },
    "ticker": {
      "value": "EXTK"
    },
    "decimals": {
      "value": 6
    },
    "logo": {
      "value": "https://example.com/logo.png"
    }
  }
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/metadata/token/f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a424c41434b
```

**Implementation Notes:**
- The endpoint performs a direct lookup in the metadata registry using the subject as the primary key
- Response properties are filtered based on their sequence numbers to return only the latest version
- Logo URLs are validated to ensure they point to accessible HTTPS resources
- The service caches frequently accessed tokens for improved performance

### List Tokens

Get a paginated list of tokens with optional filtering. This endpoint enables efficient browsing and discovery of tokens in the registry, supporting multiple filter combinations for precise results. The response includes summary information for each token, optimized for listing views and quick scanning. Pagination ensures consistent performance even with large result sets, while flexible filtering options allow users to narrow down results based on various token attributes.

**Endpoint:** `GET /metadata/tokens`

**Query Parameters:**
- **Page** (optional): The page number for pagination, starting from 1. Used to navigate through large result sets. Defaults to the first page.
- **Limit** (optional): The maximum number of tokens to return per page. Accepts values between 1 and 100, with 20 as the default. Higher limits may impact response times.
- **PolicyId** (optional): Filters results to include only tokens from a specific policy. Requires the full 56-character hexadecimal policy ID for exact matching.
- **Verified** (optional): When set to true, returns only tokens that have been verified by the registry maintainers. Verification indicates the token metadata has been reviewed for accuracy and legitimacy.
- **HasLogo** (optional): Filters results to include only tokens that have associated logo images. Particularly useful for user interfaces that need to display visual token representations.
- **Search** (optional): A text query that searches across token names and ticker symbols. The search is case-insensitive and matches partial strings, making it easy to find tokens even with incomplete information.
- **SortBy** (optional): Determines the field used for sorting results. Available options include 'name' for alphabetical sorting, 'ticker' for symbol-based ordering, and 'createdAt' for chronological arrangement. Defaults to sorting by name.
- **SortOrder** (optional): Controls the direction of sorting, accepting either 'asc' for ascending order or 'desc' for descending order. Defaults to ascending order.

**Response:**
```json
{
  "data": {
    "items": [
      {
        "subject": "subject123",
        "name": "Token Name",
        "ticker": "TKN",
        "policyId": "policy123",
        "decimals": 6,
        "verified": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

**Example:**
```bash
curl -X GET "http://localhost:5000/api/metadata/tokens?page=1&limit=20&verified=true&search=ADA"
```

**Implementation Notes:**
- Query execution uses database indexes on policy ID and verification status for optimal performance
- Search functionality leverages full-text search indexes on name and ticker fields
- The total count is calculated using efficient database aggregation, avoiding full table scans
- Response payload is minimized by excluding full metadata properties in list views

### Search Tokens

Advanced search with full-text capabilities and faceted results. This endpoint provides powerful search functionality beyond simple filtering, supporting complex queries with relevance scoring and faceted navigation. The search engine analyzes multiple token attributes simultaneously, returning results ranked by relevance. Faceted search enables users to understand result distribution across different dimensions, facilitating iterative refinement of search queries for precise discovery.

**Endpoint:** `POST /metadata/search`

**Request Body:**
```json
{
  "q": "search term",
  "filters": {
    "policies": ["policy1", "policy2"],
    "decimals": [0, 6],
    "hasLogo": true,
    "verified": true
  },
  "sort": {
    "field": "name",
    "order": "asc"
  },
  "pagination": {
    "page": 1,
    "limit": 20
  },
  "facets": ["policy", "decimals", "verified"]
}
```

**Request Parameters:**
- **Q** (required): The primary search query that will be matched against multiple token attributes including name, ticker symbol, description, and policy ID. The search engine uses relevance scoring to rank results based on how well they match the query terms.
- **Filters** (optional): An object containing various filter criteria to refine search results:
  - **Policies**: An array of policy IDs to restrict the search to specific token policies. Each policy ID should be a 56-character hexadecimal string.
  - **Decimals**: Filters tokens by their decimal precision values. Common values include 0 for non-fungible tokens and 6 for standard fungible tokens.
  - **HasLogo**: When true, includes only tokens that have logo images in their metadata. Useful for applications that require visual token identification.
  - **Verified**: When true, limits results to tokens that have been verified by the registry maintainers for authenticity and accuracy.
- **Sort** (optional): Defines how search results should be ordered:
  - **Field**: The field to sort by, such as 'name' for alphabetical ordering, 'ticker' for symbol-based sorting, or 'score' for relevance-based ranking.
  - **Order**: The sort direction, either 'asc' for ascending or 'desc' for descending order.
- **Pagination** (optional): Controls result pagination:
  - **Page**: The page number to retrieve, starting from 1.
  - **Limit**: The maximum number of results per page, typically between 1 and 100.
- **Facets** (optional): Specifies which faceted search dimensions to calculate and return. Facets provide aggregated counts for different attribute values, enabling users to understand result distribution and refine their searches iteratively.

**Response:**
```json
{
  "data": {
    "results": [
      {
        "subject": "subject123",
        "name": "Matching Token",
        "ticker": "MTK",
        "score": 0.95
      }
    ],
    "facets": {
      "policy": [
        {"value": "policy1", "count": 45},
        {"value": "policy2", "count": 23}
      ],
      "decimals": [
        {"value": "0", "count": 68},
        {"value": "6", "count": 32}
      ]
    },
    "totalCount": 100,
    "searchTimeMs": 45
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/metadata/search \
  -H "Content-Type: application/json" \
  -d '{
    "q": "gaming token",
    "filters": {
      "verified": true,
      "decimals": [0, 6]
    },
    "facets": ["policy", "decimals"]
  }'
```

**Implementation Notes:**
- Search uses ElasticSearch or similar full-text search engine for optimal performance and relevance
- The 'q' parameter searches across name, ticker, description, and policy fields with configurable weights
- Facet calculation runs in parallel with search results for minimal performance impact
- Search index is updated in near real-time as new tokens are added or modified

---

## NFT Metadata Endpoints

### Get NFT Collection

Retrieve all NFTs from a specific policy. This endpoint provides comprehensive access to NFT collections, supporting both summary views and detailed metadata retrieval. The response includes collection-level statistics and individual asset information, with flexible pagination for handling large collections efficiently. When metadata is included, the endpoint returns full CIP-25 compliant metadata for each asset in the collection.

**Endpoint:** `GET /metadata/nft/policy/{policyId}`

**Parameters:**
- **PolicyId** (required): The unique 56-character hexadecimal identifier of the NFT collection's minting policy. This serves as the primary grouping mechanism for NFTs on Cardano.
- **IncludeMetadata** (optional): When set to true, returns complete metadata for each NFT including images, attributes, and properties. Defaults to false for performance optimization.
- **Limit** (optional): Maximum number of NFTs to return in a single response. Accepts values between 1 and 1000, with 100 as the default.
- **Offset** (optional): Number of items to skip for pagination. Used in conjunction with limit to navigate through large collections.

**Response:**
```json
{
  "data": {
    "policyId": "abc123def456",
    "collectionName": "Example NFT Collection",
    "totalAssets": 100,
    "assets": [
      {
        "subject": "abc123def456asset001",
        "assetName": "asset001",
        "metadata": {
          "name": "NFT #001",
          "image": "ipfs://QmXxxxx"
        }
      }
    ]
  }
}
```

**Example:**
```bash
curl -X GET "http://localhost:5000/api/metadata/nft/policy/abc123def456?includeMetadata=true&limit=50"
```

**Implementation Notes:**
- Collection names are derived from on-chain metadata when available, falling back to policy ID display
- Asset retrieval uses indexed queries on policy ID for optimal performance
- Metadata inclusion significantly increases response size and processing time
- Results are sorted by asset name for consistent ordering across requests

### Validate NFT Metadata

Check if NFT metadata complies with CIP-25 standard. This validation endpoint ensures NFT metadata follows the Cardano Improvement Proposal 25 specification for on-chain NFT metadata. The validator performs comprehensive checks including required fields, data types, URI formats, and structural compliance, providing detailed feedback for metadata correction.

**Endpoint:** `POST /metadata/nft/validate`

**Request Parameters:**
- **PolicyId** (required): The 56-character hexadecimal policy ID that minted the NFT. Used to verify ownership and minting authority.
- **AssetName** (required): The specific asset name within the policy. Must be provided in its original format as minted on-chain.
- **Metadata** (required): The NFT metadata object to validate against CIP-25 standards:
  - **Name** (required): Display name of the NFT
  - **Image** (required): URI pointing to the NFT's primary image
  - **Description** (optional): Text description of the NFT
  - **MediaType** (optional): MIME type of the image file

**Request Body:**
```json
{
  "policyId": "policy123",
  "assetName": "MyNFT001",
  "metadata": {
    "name": "My NFT",
    "image": "ipfs://QmXxxxx"
  }
}
```

**Response:**
```json
{
  "data": {
    "isValid": true,
    "cipCompliance": {
      "cip25": true,
      "version": "1.0"
    }
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/metadata/nft/validate \
  -H "Content-Type: application/json" \
  -d '{
    "policyId": "abc123",
    "assetName": "NFT001",
    "metadata": {
      "name": "My NFT",
      "image": "ipfs://Qm..."
    }
  }'
```

**Implementation Notes:**
- Validation checks required fields (name, image) according to CIP-25 version 1
- URI formats are validated for common protocols (ipfs://, https://, ar://)
- Additional properties are allowed but generate warnings if non-standard
- The validator returns specific error messages for each validation failure

---

## Transaction Metadata Endpoints

### Get Metadata by Transaction

Retrieve all metadata associated with a specific transaction. This endpoint provides comprehensive access to transaction metadata across all labels, returning the complete metadata payload as submitted on-chain. The response includes structured data organized by metadata label, making it easy to identify different types of metadata within a single transaction.

**Endpoint:** `GET /metadata/transaction/{txHash}`

**Parameters:**
- **TxHash** (required): The 64-character hexadecimal transaction hash that uniquely identifies a transaction on the Cardano blockchain. This serves as the primary lookup key for metadata retrieval.

**Response:**
```json
{
  "data": {
    "transactionHash": "abc123def456789",
    "metadata": {
      "674": {
        "msg": ["Transaction message"]
      },
      "721": {
        "policyId": {
          "assetName": {
            "name": "NFT Name"
          }
        }
      }
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/metadata/transaction/abc123def456789
```

**Implementation Notes:**
- Metadata is retrieved directly from the blockchain or indexed database
- All metadata labels present in the transaction are included in the response
- The timestamp reflects when the transaction was included in a block
- Large metadata payloads are returned in full without truncation

### Get Metadata by Label

Query metadata entries by specific label. This endpoint enables filtered retrieval of metadata entries based on their label identifier, supporting common use cases like fetching all NFT mints (label 721) or transaction messages (label 674). The response includes pagination and date filtering for efficient data exploration across large datasets.

**Endpoint:** `GET /metadata/label/{label}`

**Parameters:**
- **Label** (required): The metadata label identifier as defined in CIP-10. Common labels include 721 for NFT metadata, 674 for transaction messages, and 20 for off-chain pool metadata.
- **Limit** (optional): Maximum number of results to return per page. Accepts values between 1 and 1000, defaulting to 20.
- **Offset** (optional): Number of results to skip for pagination. Used to navigate through large result sets.
- **StartDate** (optional): Filter results to include only metadata from transactions after this date. Must be in ISO 8601 format.
- **EndDate** (optional): Filter results to include only metadata from transactions before this date. Must be in ISO 8601 format.

**Response:**
```json
{
  "data": {
    "label": 721,
    "entries": [
      {
        "transactionHash": "tx123",
        "metadata": {
          "policyId": {
            "assetName": {
              "name": "NFT"
            }
          }
        },
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 100
    }
  }
}
```

**Example:**
```bash
curl -X GET "http://localhost:5000/api/metadata/label/721?limit=50&startDate=2024-01-01"
```

**Implementation Notes:**
- Results are ordered by timestamp descending to show most recent entries first
- Date filtering is performed on transaction inclusion time, not submission time
- Large result sets are paginated automatically to maintain consistent performance
- Metadata structure varies by label type but is returned as originally submitted

---

## Bulk Operations

### Bulk Import Metadata

Import multiple metadata entries in a single request. This endpoint enables efficient batch processing of metadata imports, supporting high-volume operations with transaction-level atomicity. The import process includes optional validation and conflict resolution strategies, making it suitable for both initial data loading and incremental updates.

**Endpoint:** `POST /metadata/bulk`

**Request Parameters:**
- **Entries** (required): Array of metadata entries to import. Each entry must include:
  - **TransactionHash**: The 64-character hex transaction identifier
  - **Label**: The metadata label as defined in CIP-10
  - **JsonData**: The metadata payload as a JSON object
  - **Timestamp**: Transaction timestamp in ISO 8601 format
- **Options** (optional): Import configuration settings:
  - **UpdateExisting**: When true, overwrites existing entries with the same transaction hash and label
  - **ValidateBeforeImport**: When true, validates all entries before importing any data

```json
{
  "entries": [
    {
      "transactionHash": "tx1",
      "label": 674,
      "jsonData": {"message": "Hello"},
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "options": {
    "updateExisting": true
  }
}
```

**Response:**
```json
{
  "data": {
    "imported": 1,
    "importId": "import_123abc"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/metadata/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "entries": [{"transactionHash": "abc123", "label": 674, "jsonData": {"msg": ["Hello"]}, "timestamp": "2024-01-15T10:30:00Z"}]
  }'
```

**Implementation Notes:**
- Imports are processed in batches for optimal database performance
- Transaction atomicity ensures all-or-nothing import behavior when validation is enabled
- The import ID can be used to track import status and retrieve detailed logs
- Large imports are processed asynchronously with progress tracking

### Export Metadata

Export metadata in various formats. This endpoint provides flexible data export capabilities for analytics, backups, and integration with external systems. The export process supports multiple output formats and filtering options, enabling users to extract precisely the data they need while maintaining performance for large datasets.

**Endpoint:** `GET /metadata/export`

**Query Parameters:**
- **Format** (required): The output format for exported data. Supported formats include 'json' for structured data, 'csv' for spreadsheet compatibility, and 'parquet' for efficient columnar storage.
- **StartDate** (optional): Filter to include only metadata from transactions after this date. Must be in ISO 8601 format.
- **EndDate** (optional): Filter to include only metadata from transactions before this date. Must be in ISO 8601 format.
- **Labels** (optional): Comma-separated list of metadata labels to include in the export. Limits results to specific metadata types.
- **Policies** (optional): Comma-separated list of policy IDs to filter NFT and token metadata. Each policy ID must be 56 characters.

**Response Headers:**
```
Content-Type: application/json
Content-Disposition: attachment; filename="metadata-export-2024-01-15.json"
```

**Example:**
```bash
curl -X GET "http://localhost:5000/api/metadata/export?format=json&labels=721,674&startDate=2024-01-01" \
  -o metadata-export.json
```

**Implementation Notes:**
- Export operations stream data to avoid memory constraints with large datasets
- CSV format flattens nested JSON structures for spreadsheet compatibility
- Parquet format preserves data types and supports efficient compression
- Exports are generated on-demand without intermediate file storage

---

## GitHub Integration

### Sync from Repository

Trigger synchronization from a GitHub repository. This endpoint initiates an asynchronous process to import metadata from structured JSON files stored in GitHub repositories. The sync operation supports incremental updates, validation workflows, and flexible path configurations, making it ideal for maintaining metadata registries through version-controlled collaboration.

**Endpoint:** `POST /github/sync`

**Request Parameters:**
- **Repository** (required): The GitHub repository identifier in 'owner/repo' format. Must be a public repository or accessible with configured credentials.
- **Branch** (required): The branch name to sync from. Typically 'main' or 'master' for production data.
- **Path** (required): The directory path within the repository containing metadata files. Supports nested paths like 'metadata/tokens'.
- **Options** (optional): Sync configuration settings:
  - **FullSync**: When true, reimports all files regardless of changes. Default is false for incremental updates.
  - **ValidateOnly**: When true, performs validation without importing data. Useful for CI/CD workflows.

```json
{
  "repository": "owner/repo-name",
  "branch": "main",
  "path": "metadata/tokens"
}
```

**Response:**
```json
{
  "data": {
    "jobId": "sync_job_123",
    "status": "processing"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/github/sync \
  -H "Content-Type: application/json" \
  -d '{
    "repository": "cardano-foundation/cardano-token-registry",
    "branch": "main",
    "path": "mappings"
  }'
```

**Implementation Notes:**
- Sync operations run asynchronously to handle large repositories efficiently
- Files are processed in parallel with configurable concurrency limits
- Only JSON files matching expected schema patterns are processed
- Changes are detected using Git commit history for incremental updates

### Check Sync Status

Monitor GitHub synchronization progress. This endpoint provides real-time status updates for ongoing sync operations, including detailed progress metrics and error reporting. Use this endpoint to track import progress, identify failed files, and determine when synchronization completes.

**Endpoint:** `GET /github/sync/{jobId}/status`

**Parameters:**
- **JobId** (required): The unique identifier returned when initiating a sync operation. Used to track specific sync jobs.

**Response:**
```json
{
  "data": {
    "jobId": "sync_job_123",
    "status": "completed",
    "progress": {
      "processedFiles": 100,
      "successfulImports": 98
    },
    "completedAt": "2024-01-15T10:35:00Z"
  }
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/github/sync/sync_job_123/status
```

**Implementation Notes:**
- Status updates are available in real-time as files are processed
- Error details are stored for failed imports to enable troubleshooting
- Completed jobs retain their status for 24 hours before automatic cleanup
- Progress metrics help estimate completion time for large sync operations
