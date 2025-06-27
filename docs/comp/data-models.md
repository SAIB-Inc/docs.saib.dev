---
sidebar_position: 3
title: Data Models
---

# Data Models

The Cardano.Metadata service uses specific data models for managing and serving Cardano token metadata. These models support the metadata registry functionality and API responses.

---

## Entity Models

### TokenMetadata

The core model representing token metadata stored in the database:

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

This record contains essential information about Cardano tokens:
- **Subject**: The unique identifier for the token
- **Name**: Human-readable name of the token
- **Ticker**: Trading symbol or ticker
- **PolicyId**: The Cardano policy ID associated with the token
- **Decimals**: Number of decimal places for the token
- **Policy**: Optional policy information
- **Url**: Optional project or token website
- **Logo**: Optional logo URL or data
- **Description**: Optional token description

### SyncState

Tracks synchronization state for metadata updates:

```csharp
public record SyncState
(
    string Hash,
    DateTimeOffset Date
);
```

Used to maintain synchronization with external metadata sources:
- **Hash**: Current state hash for tracking changes
- **Date**: Timestamp of the last synchronization

---

## Response Models

### RegistryItem

The API response model for registry queries:

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

This model wraps token metadata in a response format suitable for API consumers, using `ValueResponse<T>` wrappers for flexible value representation.

### ValueResponse

A generic wrapper for API response values:

```csharp
public record ValueResponse<T>
{
    public T Value { get; init; }
    public int SequenceNumber { get; init; }
    public List<Signature>? Signatures { get; init; }
}
```

Provides additional metadata about response values:
- **Value**: The actual data value
- **SequenceNumber**: Version or sequence tracking
- **Signatures**: Optional cryptographic signatures for data verification

---

## GitHub Integration Models

The service integrates with GitHub for metadata storage and retrieval. While the specific GitHub models are internal to the service, they support:

- Fetching metadata from GitHub repositories
- Processing pull requests and updates
- Managing metadata file structures

---

## Database Schema

The models map to a PostgreSQL database schema managed through Entity Framework Core:

- **TokenMetadata** table stores the core token information
- **SyncState** table tracks synchronization status
- Supports migrations for schema evolution

---

## Usage Context

These models serve different purposes within the Cardano.Metadata service:

1. **Storage**: `TokenMetadata` and `SyncState` persist data in PostgreSQL
2. **API Responses**: `RegistryItem` and `ValueResponse` structure API outputs
3. **Synchronization**: Models support the GitHub worker that syncs metadata
4. **Querying**: Enable efficient lookups by subject, policy ID, or other properties

The service acts as a metadata registry, providing a centralized source for Cardano token information that can be queried through its API endpoints.