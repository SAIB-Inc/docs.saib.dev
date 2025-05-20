---
title: Building Data APIs
sidebar_position: 4
hide_title: true
---

# ![Building Data APIs](/img/docs/argus/guides/data_api_banner.webp)

This guide walks through creating Application Programming Interfaces (APIs) for Cardano blockchain data indexed by Argus.Sync. We'll focus on practical implementation strategies using ASP.NET Core Minimal APIs, which provide a concise and straightforward approach to serving your indexed blockchain data to front-end UIs, backend services, and developer tools.

---

## Prerequisites

Before developing APIs with Argus.Sync, ensure your environment and data models are ready. A solid foundation here is key for a smooth development process.

- **Active Argus.Sync Project**: Your .NET project must have Argus.Sync installed and configured. For a full setup walkthrough (including data models like `IReducerModel`, basic reducer implementation, and `DbContext` configuration, e.g., `MyDbContext`), consult the comprehensive [**Quick Start Guide**](../getting-started/quick-start.md). General setup details can be found in the [Setup Guides overview](./index.md).
- **Understanding of Argus Reducers**: You should be familiar with how reducers, whether custom or [built-in](../guides/builtin-reducers.md), operate to populate your database with blockchain data.
- **ASP.NET Core Web API Knowledge**: A working knowledge of creating API endpoints using ASP.NET Core is essential. This guide particularly emphasizes the Minimal API syntax.
- **Database Fundamentals**: A basic understanding of database concepts, especially the role of indexes, will be beneficial when reviewing the optimization sections.

:::important Database Support
Currently, Argus.Sync exclusively supports **PostgreSQL** as its database backend. Ensure your environment and `DbContext` are configured accordingly.
:::

<details>
<summary><strong>Blockchain API Design Considerations</strong></summary>

When designing APIs for blockchain data, consider these special factors:

- **Data Volume**: Blockchains generate massive amounts of data. Efficient filtering and pagination are not just best practices, but necessities.
- **Data Relationships**: Blockchain entities like blocks, transactions, UTXOs, and addresses are highly interconnected. Your API design should reflect these relationships logically.
- **Historical Data**: Users often need to query historical blockchain states. Consider how to efficiently provide time-based access to data.
- **Real-time Updates**: Some applications require near real-time notification of new blocks or transactions. Consider implementing webhooks or SignalR for push-based updates.
- **Specialized Use Cases**: Different applications have very different needs - from simple balance lookups to complex analytics. Design your API to accommodate various query patterns.

</details>

---

## Getting Started with Minimal APIs

This section focuses on building API endpoints using the streamlined Minimal APIs approach in ASP.NET Core.

### Architectural Consideration: Separate API Project

For larger or production-grade systems, consider creating your **API in a separate project** rather than directly within your Argus indexer project. This modular approach offers several advantages:

**Why a Separate API Project is Often Better:**

- **Clearer Focus**: Keeps your indexer project dedicated to indexing and your API project dedicated to data exposure.
- **Independent Scaling**: Scale API instances and indexer instances independently based on their specific loads.
- **Independent Deployments**: Update and deploy the API without impacting the indexer, and vice-versa.
- **Focused Dependencies**: API projects can have web-specific dependencies (e.g., Swagger) without bloating the indexer.
- **Enhanced Security**: The API acts as a distinct security perimeter for data access.

**How This Modular Setup Works:**

1. **Shared Core Project (Class Library)**: A common class library project, referenced by both the indexer and API projects, would contain your `DbContext`, data models (`IReducerModel`), DTOs, and any shared logic or services.
2. **Unified Database**: Both the Argus indexer and the API project connect to the same PostgreSQL database.

<details>
<summary><strong>📝 Reference Architecture Diagram</strong></summary>

```json
┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │
│  Argus Indexer    │     │    API Service    │
│  Application      │     │    Application    │
│                   │     │                   │
└─────────┬─────────┘     └─────────┬─────────┘
          │                         │
          │                         │
          │     ┌─────────────────────────┐
          │     │                         │
          ├────►│   Shared Class Library  │◄─────┐
          │     │   (Models, DbContext)   │      │
          │     │                         │      │
          │     └─────────────────────────┘      │
          │                                      │
          │                                      │
          │     ┌─────────────────────────┐      │
          │     │                         │      │
          └────►│     PostgreSQL DB       │──────┘
                │                         │
                └─────────────────────────┘
```

This architecture allows the API service to read from the same database that the Argus indexer writes to, while maintaining separation of concerns and deployment flexibility.

</details>

:::info A Note on This Guide's Examples
For simplicity, the examples in this guide demonstrate adding API endpoints as if they might be in the same project. However, the core principles apply universally. We strongly recommend a separate API project for production applications.
:::

To begin creating your API endpoints:

1. **Service Registration Check**:
   Ensure `IDbContextFactory<MyDbContext>` is registered in your `Program.cs`. This is typically handled by the Argus.Sync setup if you're adding APIs to the same project, or needs to be added if it's a separate API project.

   ```csharp
   // In a separate API project's Program.cs, you might have:
   builder.Services.AddDbContextFactory<MyDbContext>(options =>
      options.UseNpgsql(builder.Configuration.GetConnectionString("CardanoContext")));
   ```

2. **Define Basic Endpoints:**:
   In your `Program.cs` (or a dedicated routes file), map HTTP requests directly to handlers.

   ```csharp
   // In Program.cs of your API Project (or Argus Project if combined)
   using YourSharedDataProject.Data; // For DbContext
   using YourSharedDataProject.Models; // For Argus models
   using YourApiProject.Dtos; // For Data Transfer Objects

   var builder = WebApplication.CreateBuilder(args);

   // Example: Ensure DbContextFactory is registered
   // This connection string would point to the database Argus.Sync populates.
   builder.Services.AddDbContextFactory<MyDbContext>(options =>
       options.UseNpgsql(builder.Configuration.GetConnectionString("CardanoContext")));

   var app = builder.Build();

   var apiV1 = app.MapGroup("/api/v1").WithTags("Cardano Data API v1");

   apiV1.MapGet("/blocks/latest", async (
       IDbContextFactory<MyDbContext> dbFactory,
       int? count) =>
   {
       try
       {
           await using var dbContext = await dbFactory.CreateDbContextAsync();
           var takeCount = count ?? 10;
           var latestBlocks = await dbContext.BlocksBySlot
               .OrderByDescending(b => b.Slot)
               .Take(takeCount)
               .Select(b => new BlockSummaryDto(b.Slot, b.Hash, b.BlockTime))
               .ToListAsync();
           return Results.Ok(latestBlocks);
       }
       catch (Exception ex)
       {
           // Proper logging of 'ex' should be implemented
           return Results.Problem("An error occurred while fetching latest blocks.", statusCode: 500);
       }
   })
   .Produces<IEnumerable<BlockSummaryDto>>(StatusCodes.Status200OK)
   .Produces(StatusCodes.Status500InternalServerError);

   apiV1.MapGet("/block/{slot:ulong}", async (
       ulong slot,
       IDbContextFactory<MyDbContext> dbFactory) =>
   {
       await using var dbContext = await dbFactory.CreateDbContextAsync();
       var blockEntity = await dbContext.BlocksBySlot
           .AsNoTracking()
           .FirstOrDefaultAsync(b => b.Slot == slot);

       if (blockEntity is null)
       {
           return Results.NotFound($"Block with slot {slot} not found.");
       }
       // It's best practice to map 'blockEntity' to a DTO.
       // Exposing the database entity directly is generally discouraged.
       // For this basic example, we'll return it, but prefer DTOs (see DTO info box below).
       var blockDto = new BlockDetailDto(blockEntity.Slot, blockEntity.Hash, blockEntity.BlockTime, blockEntity.Size, blockEntity.EpochNo, blockEntity.EpochSlot);
       return Results.Ok(blockDto);
   })
   .Produces<BlockDetailDto>()
   .Produces(StatusCodes.Status404NotFound);

   // app.Run();
   ```

   :::note Organizing Minimal APIs
   For larger applications, group related Minimal API endpoints using `RouteGroupBuilder` (as shown with `apiV1`) or explore libraries like Carter or FastEndpoints for advanced modularity.
   :::

---

## Minimal API Examples

This section provides practical examples of Minimal API endpoints, illustrating common data retrieval scenarios based on Argus-indexed data.

When building APIs on top of Argus.Sync, consider whether Data Transfer Objects (DTOs) are appropriate for your specific use case. While not always mandatory, DTOs can provide several benefits when working with blockchain data:

<details>
<summary><strong>Using DTOs with Argus.Sync (Optional)</strong></summary>
    :::info Benefits of Using DTOs
    - **Shape Data Precisely:** When needed, expose only specific fields from Argus models instead of entire entities
    - **Decouple:** Keep your API contract stable even if your internal database schema evolves
    - **Optimize Payloads:** Reduce network transfer by sending only what clients actually need
    - **Improve Security:** Control exactly which data is exposed through your API endpoints
    :::
    DTOs are particularly valuable when:
    - Your database schema contains more information than clients need
    - You want to combine data from multiple reducers into a single response
    - Your API and data layer are maintained by different teams
    - You need to transform or calculate values before presenting them

However, if your database is already well-structured for client consumption or you're building simpler endpoints with direct mappings, you can access Argus.Sync models directly without the extra abstraction layer.

```csharp
// Summarized block information, leaner than the full BlockBySlot Argus model
public record BlockSummaryDto(ulong Slot, string Hash, DateTimeOffset BlockTime);

// DTO for account balances, potentially transforming data from BalanceByAddressReducer
public record AccountBalanceDto(string Address, ulong Lovelace, Dictionary<string, ulong> Assets, ulong UpdatedAtSlot);

// A DTO for UTXO details, derived from data indexed by UtxoByAddressReducer or a custom UTXO reducer
public record UtxoDto(string TxHash, uint Index, string Address, ulong LovelaceAmount /*, other specific asset details */);

// More detailed block information, carefully selected fields from BlockBySlot
public record BlockDetailDto(ulong Slot, string Hash, DateTimeOffset BlockTime, int Size, ulong EpochNo, ulong EpochSlot /* ... other fields needed by API consumers ... */);

// DTO for DEX prices from reducers like SundaePriceByTokenReducer or MinswapPriceByTokenReducer
public record DexPriceDto(string TokenX, string TokenY, decimal PriceXPerY, decimal PriceYPerX, DateTimeOffset Timestamp);
```

When using DTOs, consider projecting directly to them in your LINQ queries for optimal performance:

```csharp
// Example of projecting directly to a DTO
var blockDto = await dbContext.BlocksBySlot
    .AsNoTracking()
    .Where(b => b.Slot == slot)
    .Select(b => new BlockDetailDto(b.Slot, b.Hash, b.BlockTime, b.Size, b.EpochNo, b.EpochSlot))
    .FirstOrDefaultAsync();
```

</details>

### Example 1: Fetching a Specific Block

- **Relevant Argus Reducer**: `BlockBySlotReducer` (populates `DbContext.BlocksBySlot`).

- **Minimal API Endpoint (within `apiV1` group)**:

  ```csharp
  // Uses BlockDetailDto for a controlled API response shape
  apiV1.MapGet("/block-details/{slot:ulong}", async (ulong slot, IDbContextFactory<MyDbContext> dbFactory) =>
  {
      await using var dbContext = await dbFactory.CreateDbContextAsync();

      var blockDto = await dbContext.BlocksBySlot
          .AsNoTracking()
          .Where(b => b.Slot == slot)
          .Select(b => new BlockDetailDto(b.Slot, b.Hash, b.BlockTime, b.Size, b.EpochNo, b.EpochSlot))
          .FirstOrDefaultAsync();

      if (blockDto is null) return Results.NotFound($"Block {slot} not found.");

      return Results.Ok(blockDto);
  })
  .Produces<BlockDetailDto>()
  .Produces(StatusCodes.Status404NotFound)
  .WithTags("Blocks API");
  ```

### Example 2: Retrieving Account Balances

- **Relevant Argus Reducer**: `BalanceByAddressReducer` (populates `DbContext.BalanceByAddress`).

- **Minimal API Endpoint (within `apiV1` group)**:

  ```csharp
  apiV1.MapGet("/account/balance/{address}", async (string address, IDbContextFactory<MyDbContext> dbFactory) =>
  {
      await using var dbContext = await dbFactory.CreateDbContextAsync();

      var balanceEntity = await dbContext.BalanceByAddress
          .AsNoTracking()
          .FirstOrDefaultAsync(b => b.Address == address);

      if (balanceEntity == null)
      {
          return Results.NotFound($"Balance data not found for {address}.");
      }

      var assetsDictionary = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, ulong>>(balanceEntity.Assets ?? "{}");

      var balanceDto = new AccountBalanceDto(
          balanceEntity.Address,
          balanceEntity.Lovelace,
          assetsDictionary,
          balanceEntity.UpdatedAtSlot
      );
      return Results.Ok(balanceDto);
  })
  .Produces<AccountBalanceDto>()
  .Produces(StatusCodes.Status404NotFound)
  .WithTags("Accounts API");
  ```

### Example 3: Listing UTXOs for an Address

- **Relevant Argus Reducer**: `UtxoByAddressReducer` tracks UTXOs. For more detailed UTXO data, a custom reducer might be needed to populate a specific table (e.g., `DetailedUtxoRecord`). This example queries `OutputBySlotReducer` data.

- **Minimal API Endpoint (within `apiV1` group)**:

  ```csharp
  apiV1.MapGet("/account/utxos/{address}", async (string address, IDbContextFactory<MyDbContext> dbFactory) =>
  {
      await using var dbContext = await dbFactory.CreateDbContextAsync();

      var utxos = await dbContext.OutputBySlot
          .AsNoTracking()
          .Where(o => o.Address == address)
          .OrderByDescending(o => o.Slot)
          .Select(o => new UtxoDto(o.Id, (uint)o.Index, o.Address, 0 /* Placeholder; see note on UTXO data */ ))
          .ToListAsync();

      return !utxos.Any()
          ? Results.NotFound("No UTXOs found for this address.")
          : Results.Ok(utxos);
  })
  .Produces<IEnumerable<UtxoDto>>()
  .Produces(StatusCodes.Status404NotFound)
  .WithTags("Accounts API");
  ```

  :::warning Important Note on UTXO Data
  The built-in `OutputBySlotReducer` stores the raw CBOR of the output. The `Amount` (Value) and `Datum` are transient and not directly stored as simple columns. To serve detailed UTXO asset information easily via an API, you would typically:

  1. Create a **custom Argus reducer** that processes `TransactionOutputs`, extracts Lovelace and native asset quantities, and stores them in dedicated table columns.
  2. Or, use the Chrysalis library (which Argus leverages for CBOR processing) to deserialize the `RawCbor` field from the `OutputBySlot` table.
     :::

### Example 4: Querying DEX Token Prices

- **Relevant Argus Reducer**: E.g., `SundaePriceByTokenReducer` or `MinswapPriceByTokenReducer`.

- **Minimal API Endpoint (within `apiV1` group)**:

  ```csharp
  apiV1.MapGet("/dex/price/sundae", async (
      string tokenASubject,
      string tokenBSubject,
      IDbContextFactory<MyDbContext> dbFactory) =>
  {
      await using var dbContext = await dbFactory.CreateDbContextAsync();

      var latestPriceEntity = await dbContext.SundaePriceByToken
          .AsNoTracking()
          .Where(p => (p.TokenXSubject == tokenASubject && p.TokenYSubject == tokenBSubject) ||
                       (p.TokenXSubject == tokenBSubject && p.TokenYSubject == tokenASubject))
          .OrderByDescending(p => p.Slot)
          .FirstOrDefaultAsync();

      if (latestPriceEntity == null)
      {
          return Results.NotFound($"Price data not found for pair {tokenASubject}/{tokenBSubject}.");
      }

      var priceDto = new DexPriceDto(
          latestPriceEntity.TokenXSubject,
          latestPriceEntity.TokenYSubject,
          latestPriceEntity.TokenXPerTokenY,
          latestPriceEntity.TokenYPerTokenX,
          latestPriceEntity.Timestamp
      );

      return Results.Ok(priceDto);
  })
  .Produces<DexPriceDto>()
  .Produces(StatusCodes.Status404NotFound)
  .WithTags("DEX API");
  ```

---

## Argus.Sync API Best Practices

Building efficient and maintainable APIs on top of Argus.Sync involves specific considerations due to the nature of blockchain data and how Argus processes it.

### Design Lean DTOs and Use Projections

Argus reducers, like the built-in `BlockBySlotReducer`, `TxBySlotReducer`, or `BalanceByAddressReducer`, are designed to capture blockchain data comprehensively. Your API, however, should serve specific needs.

- **Shape Your Data**: Define Data Transfer Objects (DTOs) that precisely match what your API consumers require. Avoid exposing the raw Argus database entities directly if they contain excessive data for the API context. This is critical for performance with potentially large Cardano transaction outputs or complex metadata that Argus might store.

- **Selective Loading**: Always use `.Select(entity => new YourDto(...))` in your LINQ queries against Argus-populated tables. This translates to optimized SQL, fetching only the necessary columns from the database, reducing data transfer and processing overhead.

  ```csharp
  // Example: Fetching only specific fields from BlockBySlot for a summary
  var blockSummaries = await dbContext.BlocksBySlot
      .OrderByDescending(b => b.Slot)
      .Take(10)
      .Select(b => new BlockSummaryDto(b.Slot, b.Hash, b.BlockTime)) // Projection to DTO
      .ToListAsync();
  ```

### Optimize Database Interactions with Argus Tables

Efficiently querying the database populated by Argus is key.

**Targeted Indexing**:

- Argus's built-in reducers typically define primary keys on their tables (e.g., `BlockBySlot.Slot`, `TxBySlot.Hash`, `BalanceByAddress.Address`) which are automatically indexed.
- However, your API's query patterns might require additional custom indexes. For example, if you frequently query the table populated by `UtxoByAddressReducer` by `Slot` range, or a custom dApp reducer's table by a specific metadata attribute, ensure those columns are indexed.
- Define custom indexes in your `DbContext.OnModelCreating`:

  ```csharp
  // Inside YourDbContext.OnModelCreating(ModelBuilder modelBuilder)
  modelBuilder.Entity<YourCustomDappData>().HasIndex(d => d.RelevantMetadataField);
  modelBuilder.Entity<BalanceByAddress>().HasIndex(b => b.UpdatedAtSlot);
  ```

- Remember to create and apply migrations after adding indexes: `dotnet ef migrations add AddCustomIndexes`, `dotnet ef database update`.

**Efficient Querying Techniques**:

- For read-only API endpoints (most `GET` requests), always use `.AsNoTracking()` when querying Argus data. This prevents Entity Framework Core from tracking changes, leading to faster query execution.
- Apply filtering conditions (`Where` clauses) as early as possible in your LINQ queries. This allows the database to perform the filtering efficiently, especially on indexed columns of Argus tables. Practices

When building APIs for data indexed with Argus.Sync, following our recommended patterns will help you achieve optimal performance and maintainability.

### Dynamic Query Construction with Argus' PredicateBuilder

:::info Optimizing Complex Queries
Argus.Sync provides a built-in `PredicateBuilder` utility specifically designed for constructing dynamic LINQ expressions when querying blockchain data. This utility simplifies building complex, dynamic queries for Cardano blockchain data.
:::

```csharp
// Argus.Sync includes its own PredicateBuilder utility
using System.Linq.Expressions;
using Argus.Sync.Utils;

// The built-in implementation is lightweight but powerful
public static class PredicateBuilder
{
    public static Expression<Func<T, bool>> False<T>() => _ => false;
    public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> expr1, Expression<Func<T, bool>> expr2)
    {
        var invokedExpr = Expression.Invoke(expr2, expr1.Parameters);
        return Expression.Lambda<Func<T, bool>>(Expression.OrElse(expr1.Body, invokedExpr), expr1.Parameters);
    }
}
```

**Key Benefits for Cardano Data APIs:**

- Build dynamic queries for complex blockchain data filtering
- Combine multiple filter conditions with logical OR operations
- Handle optional query parameters elegantly
- Construct efficient queries for token searches, address filtering, and more
- No external dependencies required

#### Example: Optimizing Asset Lookups with Argus PredicateBuilder

Using Argus.Sync's built-in PredicateBuilder to optimize the asset lookup example:

```csharp
// Original inefficient implementation with multiple DB roundtrips
foreach (var asset in assets)
{
    var metadata = await dbContext.TokenMetadata
        .FirstOrDefaultAsync(t => t.PolicyId + t.AssetName == asset.Key);

    var price = await dbContext.TokenPrices
        .OrderByDescending(p => p.Timestamp)
        .FirstOrDefaultAsync(p => p.AssetId == asset.Key);

    assetDetails.Add(new AssetDetailDto(
        asset.Key,
        metadata?.Name ?? "Unknown",
        asset.Value,
        price?.PriceInAda ?? 0,
        (price?.PriceInAda ?? 0) * asset.Value
    ));
}
```

Optimized implementation with Argus's PredicateBuilder:

```csharp
// Get all asset IDs
var assetIds = assets.Select(a => a.Key).ToList();

// Build efficient metadata lookup predicate
var metadataPredicate = PredicateBuilder.False<TokenMetadata>();
foreach (var assetId in assetIds)
{
    string id = assetId; // Important: capture variable for closure
    metadataPredicate = metadataPredicate.Or(t => t.PolicyId + t.AssetName == id);
}

// Single efficient query for all metadata
var metadataList = await dbContext.TokenMetadata
    .AsNoTracking()
    .Where(metadataPredicate)
    .ToListAsync();
var metadataDict = metadataList.ToDictionary(m => m.PolicyId + m.AssetName);

// Build price lookup predicate
var pricePredicate = PredicateBuilder.False<TokenPrice>();
foreach (var assetId in assetIds)
{
    string id = assetId; // Important: capture variable for closure
    pricePredicate = pricePredicate.Or(p => p.AssetId == id);
}

// Get latest prices efficiently
var pricesList = await dbContext.TokenPrices
    .AsNoTracking()
    .Where(pricePredicate)
    .ToListAsync();

// Process prices to get just the latest for each asset
var latestPrices = pricesList
    .GroupBy(p => p.AssetId)
    .ToDictionary(
        g => g.Key,
        g => g.OrderByDescending(p => p.Timestamp).First()
    );

// Create DTOs using the dictionaries
var assetDetails = assets.Select(asset => {
    metadataDict.TryGetValue(asset.Key, out var metadata);
    latestPrices.TryGetValue(asset.Key, out var price);

    return new AssetDetailDto(
        asset.Key,
        metadata?.Name ?? "Unknown",
        asset.Value,
        price?.PriceInAda ?? 0,
        (price?.PriceInAda ?? 0) * asset.Value
    );
}).ToList();
```

This approach significantly improves performance by reducing database roundtrips from `2 * assets.Count` to just 2 total queries. For large token portfolios (common in Cardano wallets), this can be the difference between an API that times out and one that performs efficiently.

**Advanced Example: Finding Smart Contract Interactions**

```csharp
// Find all transactions that interact with any of several smart contracts
apiV1.MapGet("/contracts/transactions", async (
    [FromQuery] string[] scriptHashes,
    [FromQuery] ulong? fromSlot,
    [FromQuery] ulong? toSlot,
    IDbContextFactory<MyDbContext> dbFactory) =>
{
    await using var dbContext = await dbFactory.CreateDbContextAsync();

    // Build script hash predicate
    var predicate = PredicateBuilder.False<Transaction>();
    foreach (var hash in scriptHashes)
    {
        // Capture variable to avoid closure issues
        string scriptHash = hash;
        predicate = predicate.Or(tx =>
            tx.Outputs.Any(o => o.ScriptHash == scriptHash));
    }

    // Apply slot range if provided
    var query = dbContext.Transactions.AsNoTracking();

    if (fromSlot.HasValue)
        query = query.Where(tx => tx.Slot >= fromSlot.Value);

    if (toSlot.HasValue)
        query = query.Where(tx => tx.Slot <= toSlot.Value);

    // Apply the contract interaction predicate
    query = query.Where(predicate);

    // Get results
    var results = await query
        .OrderByDescending(tx => tx.Slot)
        .Take(100)
        .Select(tx => new ContractTransactionDto(
            tx.Hash,
            tx.Slot,
            tx.BlockTime,
            scriptHashes.FirstOrDefault(sh =>
                tx.Outputs.Any(o => o.ScriptHash == sh))
        ))
        .ToListAsync();

    return Results.Ok(results);
})
.WithName("GetContractTransactions");
```

<details>
<summary><strong>When to Use PredicateBuilder</strong></summary>

:::info Common Use Cases for PredicateBuilder

| Scenario                        | Example                                                        |
| ------------------------------- | -------------------------------------------------------------- |
| **Multiple OR conditions**      | Searching for transactions matching any of several criteria    |
| **Multi-address operations**    | Finding transactions across a set of related wallet addresses  |
| **Token collections**           | Querying assets belonging to a specific policy ID group        |
| **Smart contract interactions** | Identifying transactions that interact with specific contracts |
| **Dynamic filter criteria**     | Handling variable search parameters in API endpoints           |

:::

Remember that Argus.Sync's built-in PredicateBuilder focuses on the `Or` operation. For more complex query needs, you may consider extending it with additional methods or using the more fully-featured LinqKit package alongside it.

</details>

---

With these guidelines in mind, you'll be well-equipped to build robust APIs that make your indexed Cardano blockchain data accessible and useful for a wide range of applications.
