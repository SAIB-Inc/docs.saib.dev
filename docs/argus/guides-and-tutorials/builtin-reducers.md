---
title: Using Built-in Reducers
sidebar_position: 2
hide_title: true
---

![Argus Built-in Reducers](/img/docs/argus/guides-and-tutorials/builtin-reducers-banner.webp)

This guide explains the built-in reducers available in Argus and how to use them to efficiently index and query Cardano blockchain data for your applications.

---

## Introduction

Argus provides a comprehensive collection of pre-built reducers that handle common blockchain data indexing needs. These reducers save significant development time by handling the complex logic of parsing and transforming raw blockchain data. They offer production-tested reliability, optimized performance through efficient database schemas, maintenance-free updates that adapt to protocol changes, and standardized models for consistent access patterns across projects.

While you can always create custom reducers for specialized needs, built-in reducers provide robust, ready-to-use solutions for common indexing patterns. These reducers fall into two main categories:

- [General-purpose reducers](#general-reducers) for core blockchain data
- [DApp-specific reducers](#dapp-reducers) for specialized Cardano protocols

---

## Available Reducers

### General Reducers

These reducers handle fundamental blockchain data structures that are useful for most applications:

| Reducer | Description |
| ------- | ----------- |
| **BlockBySlotReducer** | Indexes blocks by their slot number for fast lookups |
| **TxBySlotReducer** | Indexes transactions chronologically by slot for historical analysis |
| **UtxoByAddressReducer** | Tracks UTXOs for specific addresses to monitor balances and activity |
| **OutputBySlotReducer** | Indexes transaction outputs by slot for historical output analysis |
| **BalanceByAddressReducer** | Tracks address balances for both ADA and native assets |

:::tip Why Use General Reducers
General reducers provide the foundation for most blockchain applications. They handle common tasks like finding transactions, tracking UTXOs, and monitoring address balances, saving you from implementing these patterns from scratch.
:::

### DApp Reducers

These reducers are tailored for specific Cardano DApps and protocols:

**SundaePriceByTokenReducer**  
Tracks token prices and swaps on SundaeSwap DEX

**MinswapPriceByTokenReducer**  
Monitors prices on Minswap DEX pools

**JpgPriceByTokenReducer**  
Tracks NFT sales on JPG Store marketplace

**SplashPriceByTokenReducer**  
Tracks token prices on Splash DEX

<details>
<summary>Why DApp-Specific Reducers Matter</summary>

DApp-specific reducers handle the complex logic of parsing specialized transaction patterns used by popular Cardano protocols. This provides several benefits:

- **Immediate integration** with established ecosystems
- **Protocol-aware data models** designed for specific use cases
- **Optimized queries** for common DApp operations
- **Automatic updates** when protocols evolve

Instead of building custom parsing logic for each DApp, you can use these reducers as building blocks for advanced applications like price aggregators, trading tools, and DeFi dashboards.
</details>

---

## Setting Up Reducers

Follow these steps to add reducers to your Argus project:

### 1. Create Your Database Context

Your `DbContext` should inherit from `CardanoDbContext`:

```csharp
public class MyCardanoDbContext : CardanoDbContext
{
    public MyCardanoDbContext(DbContextOptions<MyCardanoDbContext> options,
                           IConfiguration configuration)
        : base(options, configuration)
    {
    }
}
```

### 2. Register the Indexer and Reducers

In your `Program.cs`, register the Cardano indexer and reducers:

```csharp
// Add Cardano indexer with your database context
builder.Services.AddCardanoIndexer<MyCardanoDbContext>(builder.Configuration);

// Add specific reducers
builder.Services.AddReducers<MyCardanoDbContext, IReducerModel>([
    typeof(BlockBySlotReducer<>),
    typeof(TxBySlotReducer<>),
    typeof(UtxoByAddressReducer<>),
    typeof(OutputBySlotReducer<>),
    typeof(BalanceByAddressReducer<>)
    // Add other reducers as needed
]);
```

### 3. Configure Connection Settings

Configure your application in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=argus-db;Username=postgres;Password=yourpassword;Port=5432;",
    "CardanoContextSchema": "public"
  },
  "CardanoNodeConnection": {
    "ConnectionType": "UnixSocket", // or "gRPC"
    "UnixSocket": {
      "Path": "/path/to/node.socket"
    },
    "gRPC": {
      "Endpoint": "http://localhost:50051",
      "ApiKey": "your-api-key"
    },
    "NetworkMagic": 2, // 1 for mainnet, 2 for preview, 1097911063 for preprod
    "MaxRollbackSlots": 1000,
    "RollbackBuffer": 10
  },
  "Sync": {
    "Dashboard": {
      "TuiMode": true,
      "RefreshInterval": 5000, 
      "DisplayType": "Full"
    },
    "State": {
      "ReducerStateSyncInterval": 5000
    }
  }
}
```

### 4. Create and Apply Migrations

Set up your database with Entity Framework migrations:

```bash
# Add migration
dotnet ef migrations add InitialMigration

# Apply migration
dotnet ef database update
```

When you run your application, Argus will automatically connect to the Cardano node, begin indexing blockchain data, process it through your registered reducers, and store the results in your database.

---

## General Reducer Models

### BlockBySlot

Indexes blocks by their slot number for quick lookup.

| Property  | Type           | Description                     |
| --------- | -------------- | ------------------------------- |
| Slot      | ulong          | Block slot number (primary key) |
| Hash      | string         | Block hash as hex string        |
| BlockTime | DateTimeOffset | Timestamp of block creation     |
| Size      | int            | Size of the block in bytes      |
| EpochNo   | ulong          | Epoch number                    |
| EpochSlot | ulong          | Slot within the epoch           |

**Example query:**

```csharp
using (var context = await _dbContextFactory.CreateDbContextAsync())
{
    var block = await context.BlocksBySlot
        .FirstOrDefaultAsync(b => b.Slot == 12345678);

    Console.WriteLine($"Block Hash: {block.Hash}");
    Console.WriteLine($"Block Time: {block.BlockTime}");
}
```

:::tip Block Lookup Use Cases
This reducer is particularly useful for:
- Building block explorers
- Implementing time-based queries
- Converting slot numbers to timestamps
- Tracking chain reorganizations
:::

### TxBySlot

Indexes transactions chronologically by slot.

| Property | Type   | Description                                                |
| -------- | ------ | ---------------------------------------------------------- |
| Slot     | ulong  | Block slot number (part of composite key)                  |
| Hash     | string | Transaction hash as hex string (part of composite key)     |
| Index    | ulong  | Transaction index within the block (part of composite key) |
| RawCbor  | byte[] | Raw CBOR bytes of the transaction                          |

**Example query:**

```csharp
using (var context = await _dbContextFactory.CreateDbContextAsync())
{
    var recentTxs = await context.TxBySlot
        .Where(tx => tx.Slot >= startSlot && tx.Slot <= endSlot)
        .OrderBy(tx => tx.Slot)
        .ThenBy(tx => tx.Index)
        .ToListAsync();

    foreach (var tx in recentTxs)
    {
        Console.WriteLine($"Tx Hash: {tx.Hash} at Slot: {tx.Slot}");
    }
}
```

<details>
<summary>Transaction Indexing Considerations</summary>

When using the TxBySlot reducer:

- Consider the query patterns your application needs most
- For time-based queries, filter by slot range
- For specific transaction lookups, query by hash
- The raw CBOR data lets you decode transaction details when needed
- Use in combination with other reducers for more advanced queries

This reducer provides the chronological backbone for transaction history, while other reducers can index specific transaction aspects.
</details>

### OutputBySlot

Tracks transaction outputs by slot for historical analysis.

| Property | Type   | Description                                                 |
| -------- | ------ | ----------------------------------------------------------- |
| Slot     | ulong  | Block slot number (part of composite key)                   |
| Id       | string | Transaction ID (part of composite key)                      |
| Index    | ulong  | Output index within the transaction (part of composite key) |
| Address  | string | Bech32 address                                              |
| RawCbor  | byte[] | Raw CBOR bytes of the output                                |
| Amount   | Value  | Value of the output (transient, not stored)                 |
| Datum    | Datum  | Datum attached to the output (transient, not stored)        |

**Example query:**

```csharp
using (var context = await _dbContextFactory.CreateDbContextAsync())
{
    var outputs = await context.OutputBySlot
        .Where(o => o.Slot == targetSlot)
        .ToListAsync();

    foreach (var output in outputs)
    {
        Console.WriteLine($"Output: {output.Id}#{output.Index} to {output.Address}");
    }
}
```

:::warning Transient Properties
Note that `Amount` and `Datum` are transient properties populated when querying but not stored in the database. These are parsed from the `RawCbor` field when needed, so you can access them in your code but can't filter by them in LINQ queries.
:::

### BalanceByAddress

Monitors address balances for both ADA and native assets.

| Property      | Type   | Description                        |
| ------------- | ------ | ---------------------------------- |
| Address       | string | Bech32 address (primary key)       |
| Assets        | string | JSON representation of assets      |
| Lovelace      | ulong  | ADA amount in lovelace             |
| UpdatedAtSlot | ulong  | Slot when balance was last updated |

**Example query:**

```csharp
using (var context = await _dbContextFactory.CreateDbContextAsync())
{
    var balance = await context.BalanceByAddress
        .FirstOrDefaultAsync(b => b.Address == "addr1...");

    Console.WriteLine($"Balance: {balance.Lovelace / 1_000_000.0} ₳");
    Console.WriteLine($"Last updated at slot: {balance.UpdatedAtSlot}");

    // Parse assets JSON if needed
    var assets = JsonSerializer.Deserialize<Dictionary<string, ulong>>(balance.Assets);
    foreach (var (assetId, amount) in assets)
    {
        Console.WriteLine($"Asset: {assetId}, Amount: {amount}");
    }
}
```

:::tip Balance Tracking Applications
This reducer is essential for:
- Wallet applications tracking user balances
- Analytics dashboards monitoring large addresses
- DeFi applications tracking liquidity positions
- Trading tools monitoring asset movements
:::

---

## DApp Reducer Models

### SundaePriceByToken

Tracks token prices and swaps on SundaeSwap DEX.

| Property        | Type           | Description                                   |
| --------------- | -------------- | --------------------------------------------- |
| Slot            | ulong          | Block slot number (part of composite key)     |
| TxHash          | string         | Transaction hash (part of composite key)      |
| TxIndex         | ulong          | Transaction index (part of composite key)     |
| TokenXSubject   | string         | First token asset ID (part of composite key)  |
| TokenYSubject   | string         | Second token asset ID (part of composite key) |
| TokenXQuantity  | ulong          | Quantity of first token                       |
| TokenYQuantity  | ulong          | Quantity of second token                      |
| TokenXPerTokenY | decimal        | Exchange rate (TokenX per TokenY)             |
| TokenYPerTokenX | decimal        | Exchange rate (TokenY per TokenX)             |
| Timestamp       | DateTimeOffset | Time of the transaction                       |

**Example query:**

```csharp
// Query SundaeSwap price for ADA/HOSKY pair
var tokenPrices = await context.PriceByToken
    .Where(p =>
        (p.TokenXSubject == "lovelace" && p.TokenYSubject == "a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235.484f534b59") ||
        (p.TokenXSubject == "a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235.484f534b59" && p.TokenYSubject == "lovelace")
    )
    .OrderByDescending(p => p.Slot)
    .Take(10)
    .ToListAsync();

// Access latest price
var latestPrice = tokenPrices.FirstOrDefault();
if (latestPrice.TokenXSubject == "lovelace")
{
    Console.WriteLine($"Latest price: {latestPrice.TokenXPerTokenY} ADA per HOSKY");
}
else
{
    Console.WriteLine($"Latest price: {latestPrice.TokenYPerTokenX} ADA per HOSKY");
}
```

<details>
<summary>SundaeSwap DEX Insights</summary>

The SundaePriceByToken reducer:

- Detects swaps executed on SundaeSwap DEX
- Calculates precise exchange rates for each trading pair
- Tracks swap volumes and liquidity movements
- Supports both ADA and token-to-token pairs
- Provides timestamps for time-based analysis

This data can power price charts, trading volume analytics, and arbitrage tools specifically for the SundaeSwap ecosystem.
</details>

### MinswapPriceByToken

Monitors prices on Minswap DEX pools.

| Property        | Type           | Description                                   |
| --------------- | -------------- | --------------------------------------------- |
| Slot            | ulong          | Block slot number (part of composite key)     |
| TxHash          | string         | Transaction hash (part of composite key)      |
| TxIndex         | ulong          | Transaction index (part of composite key)     |
| TokenXSubject   | string         | First token asset ID (part of composite key)  |
| TokenYSubject   | string         | Second token asset ID (part of composite key) |
| TokenXQuantity  | ulong          | Quantity of first token                       |
| TokenYQuantity  | ulong          | Quantity of second token                      |
| TokenXPerTokenY | decimal        | Exchange rate (TokenX per TokenY)             |
| TokenYPerTokenX | decimal        | Exchange rate (TokenY per TokenX)             |
| PoolId          | string         | Minswap pool identifier                       |
| Timestamp       | DateTimeOffset | Time of the transaction                       |

**Example query:**

```csharp
// Calculate price change over time for a specific pool
var poolPrices = await context.PriceByToken
    .Where(p => p.PoolId == "pool1...")
    .OrderByDescending(p => p.Slot)
    .Take(100)
    .ToListAsync();

if (poolPrices.Count >= 2)
{
    var newest = poolPrices.First();
    var oldest = poolPrices.Last();
    var priceChange = newest.TokenXPerTokenY - oldest.TokenXPerTokenY;
    var percentChange = (priceChange / oldest.TokenXPerTokenY) * 100;

    Console.WriteLine($"Price change over period: {percentChange:F2}%");
}
```

:::info Minswap vs SundaeSwap Reducers
Note that the Minswap reducer includes an additional `PoolId` field not present in the SundaeSwap reducer. This reflects the architectural differences between the two DEXs, with Minswap using explicit pool contracts with unique identifiers.
:::

### JpgPriceByToken

Tracks NFT sales on JPG Store marketplace.

| Property        | Type           | Description                               |
| --------------- | -------------- | ----------------------------------------- |
| Slot            | ulong          | Block slot number (part of composite key) |
| TxHash          | string         | Transaction hash (part of composite key)  |
| TxIndex         | ulong          | Transaction index (part of composite key) |
| Subject         | string         | NFT asset ID (part of composite key)      |
| PriceInLovelace | ulong          | Price paid in lovelace                    |
| BuyerAddress    | string         | Address of the buyer                      |
| SellerAddress   | string         | Address of the seller                     |
| Timestamp       | DateTimeOffset | Time of the transaction                   |

**Example query:**

```csharp
// Analyze NFT collection sales statistics
var collectionSales = await context.PriceByToken
    .Where(p => p.Subject.StartsWith("d894897411707efa755a76deb66d26dfd50593f2e70863e1661e98a0."))
    .OrderByDescending(p => p.Timestamp)
    .Take(20)
    .ToListAsync();

// Calculate floor price
var floorPrice = collectionSales.Min(s => s.PriceInLovelace) / 1_000_000.0;
Console.WriteLine($"Collection floor price: {floorPrice} ₳");

// Calculate average sale price
var avgPrice = collectionSales.Average(s => s.PriceInLovelace) / 1_000_000.0;
Console.WriteLine($"Average sale price: {avgPrice} ₳");
```

:::tip NFT Market Analysis
This reducer is perfect for:
- Tracking floor prices for collections
- Analyzing NFT market trends
- Monitoring specific assets or collections
- Building rarity-based pricing models
- Identifying whale buyers and sellers
:::

### SplashPriceByToken

Tracks token prices on the Splash DEX.

| Property        | Type           | Description                                   |
| --------------- | -------------- | --------------------------------------------- |
| Slot            | ulong          | Block slot number (part of composite key)     |
| TxHash          | string         | Transaction hash (part of composite key)      |
| TxIndex         | ulong          | Transaction index (part of composite key)     |
| TokenXSubject   | string         | First token asset ID (part of composite key)  |
| TokenYSubject   | string         | Second token asset ID (part of composite key) |
| TokenXQuantity  | ulong          | Quantity of first token                       |
| TokenYQuantity  | ulong          | Quantity of second token                      |
| TokenXPerTokenY | decimal        | Exchange rate (TokenX per TokenY)             |
| TokenYPerTokenX | decimal        | Exchange rate (TokenY per TokenX)             |
| Timestamp       | DateTimeOffset | Time of the transaction                       |

**Example query:**

```csharp
// Find latest price for a specific token pair
var latestPrice = await context.PriceByToken
    .Where(p =>
        (p.TokenXSubject == "lovelace" && p.TokenYSubject == "targetTokenId") ||
        (p.TokenXSubject == "targetTokenId" && p.TokenYSubject == "lovelace")
    )
    .OrderByDescending(p => p.Slot)
    .FirstOrDefaultAsync();

if (latestPrice != null)
{
    if (latestPrice.TokenXSubject == "lovelace")
    {
        Console.WriteLine($"Latest price: {latestPrice.TokenXPerTokenY} ADA per token");
    }
    else
    {
        Console.WriteLine($"Latest price: {latestPrice.TokenYPerTokenX} ADA per token");
    }
}
```

<details>
<summary>Combining DEX Reducers</summary>

A powerful approach is to use multiple DEX reducers together to:

1. Compare prices across different exchanges
2. Calculate arbitrage opportunities
3. Create aggregated price feeds
4. Track liquidity migration between protocols
5. Build comprehensive trading dashboards

Each reducer provides protocol-specific data, but combining them gives you a complete view of the Cardano DeFi ecosystem.
</details>

---

Argus's built-in reducers provide a powerful foundation for building blockchain applications that need to index and query Cardano data efficiently. By combining general-purpose reducers for blockchain primitives with specialized DApp reducers for protocol-specific data, you can quickly build sophisticated applications without having to implement complex transaction parsing logic. As the Cardano ecosystem continues to evolve, Argus reducers will be updated to support new protocols and data structures, ensuring your applications stay current with the latest developments in the blockchain.