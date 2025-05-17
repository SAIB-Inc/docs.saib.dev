---
sidebar_position: 2
title: Built-in Reducers
---

# 🔄 Using Built-in Reducers

Argus provides a powerful collection of built-in reducers to help you quickly index and query Cardano blockchain data. This guide will walk you through using these reducers in your project and explain the data they make available.
<br />

Argus ships with two categories of reducers:

### General Reducers

These reducers handle common blockchain data structures:
<br />

- **BlockBySlotReducer**: Indexes blocks by their slot number
- **TxBySlotReducer**: Indexes transactions chronologically by slot
- **UtxoByAddressReducer**: Tracks UTXOs for specific addresses
- **OutputBySlotReducer**: Indexes transaction outputs by slot
- **BalanceByAddressReducer**: Tracks address balances

### DApp Reducers

These reducers are tailored for specific Cardano dApps:
<br />

- **SundaePriceByTokenReducer**: Tracks token prices on SundaeSwap DEX
- **MinswapPriceByTokenReducer**: Monitors Minswap DEX prices
- **JpgPriceByTokenReducer**: Tracks NFT prices on JPG Store
- **SplashPriceByTokenReducer**: Tracks token prices on Splash DEX

## 🛠️ Using Reducers in Your Project

Adding reducers to your application is straightforward. Here's how to get started:

### 1. Set Up Your Database Context

First, ensure your DbContext inherits from `CardanoDbContext`:

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

In your application's startup code (typically `Program.cs`), register the Cardano indexer and the reducers you want to use:

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

Ensure your `appsettings.json` includes the necessary connection information:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  },
  "AllowedHosts": "*",
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
    "RollbackBuffer": 10,
    "Slot": 0, // Optional: start sync from specific slot
    "Hash": "" // Optional: start sync from specific block hash
  },
  "Sync": {
    "Rollback": {
      "Enabled": false,
      "RollbackHash": "", // Hash to roll back to
      "RollbackSlot": 0, // Slot to roll back to
      "Reducers": {
        // Reducer-specific rollback configuration
        "BlockBySlotReducer": {
          "Enabled": true,
          "RollbackHash": "",
          "RollbackSlot": 0
        }
      }
    },
    "Dashboard": {
      "TuiMode": true, // Enable Text User Interface
      "RefreshInterval": 5000, // Refresh interval in milliseconds
      "DisplayType": "Full" // Display mode
    },
    "State": {
      "ReducerStateSyncInterval": 5000 // Interval to update reducer state
    }
  }
}
```

### 4. Generate and Apply Migrations

Before running your application, you need to create and apply database migrations:

```bash
# Add migration
dotnet ef migrations add InitialMigration

# Apply migration to create database schema
dotnet ef database update
```

### 5. Run Your Application

When you run your application, Argus will automatically:
<br />

1. Connect to the Cardano node
2. Begin indexing blockchain data
3. Process the data through your registered reducers
4. Store the results in your database

## 📊 Available Data Models

Each reducer stores specific data in your database. Here's a breakdown of what each makes available:

### General Reducers Data Models

- [BlockBySlot](#blockbyslot)
- [TxBySlot](#txbyslot)
- [OutputBySlot](#outputbyslot)
- [BalanceByAddress](#balancebyaddress)

### DApp Reducers Data Models

- [SundaePriceByToken](#sundaepricebytoken)
- [MinswapPriceByToken](#minswappricebytoken)
- [JpgPriceByToken](#jpgpricebytoken)
- [SplashPriceByToken](#splashpricebytoken)

## General Reducer Models

### BlockBySlot

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

    // Access block data
    Console.WriteLine($"Block Hash: {block.Hash}");
    Console.WriteLine($"Block Time: {block.BlockTime}");
}
```

### TxBySlot

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

### OutputBySlot

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

### BalanceByAddress

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

## DApp Reducer Models

### SundaePriceByToken

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
using (var context = await _dbContextFactory.CreateDbContextAsync())
{
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
}
```

### MinswapPriceByToken

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
using (var context = await _dbContextFactory.CreateDbContextAsync())
{
    // Query Minswap price history for a specific pool
    var poolPrices = await context.PriceByToken
        .Where(p => p.PoolId == "pool1...")
        .OrderByDescending(p => p.Slot)
        .Take(100)
        .ToListAsync();

    // Calculate price change over time
    if (poolPrices.Count >= 2)
    {
        var newest = poolPrices.First();
        var oldest = poolPrices.Last();
        var priceChange = newest.TokenXPerTokenY - oldest.TokenXPerTokenY;
        var percentChange = (priceChange / oldest.TokenXPerTokenY) * 100;

        Console.WriteLine($"Price change over period: {percentChange:F2}%");
    }
}
```

### JpgPriceByToken

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
using (var context = await _dbContextFactory.CreateDbContextAsync())
{
    // Find recent sales for a specific NFT collection
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
}
```

### SplashPriceByToken

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
using (var context = await _dbContextFactory.CreateDbContextAsync())
{
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
}
```

## 🔧 Creating Custom Reducers

While Argus provides many built-in reducers, you may need to create custom ones for specific use cases. A custom reducer implements the `IReducer<T>` interface:

```csharp
public class MyCustomReducer<TContext> : IReducer<MyCustomModel>
    where TContext : CardanoDbContext, IMyCustomDbContext
{
    private readonly IDbContextFactory<TContext> _dbContextFactory;

    public MyCustomReducer(IDbContextFactory<TContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task RollForwardAsync(Block block)
    {
        // Process new block data
        using var context = await _dbContextFactory.CreateDbContextAsync();

        foreach (var tx in block.TransactionBodies)
        {
            // Extract and process data from transactions
            // Store results in database
        }

        await context.SaveChangesAsync();
    }

    public async Task RollBackwardAsync(ulong slot)
    {
        // Handle chain reorganizations by removing data after the given slot
        using var context = await _dbContextFactory.CreateDbContextAsync();

        await context.MyCustomModels
            .Where(m => m.Slot > slot)
            .ExecuteDeleteAsync();
    }
}
```

Register your custom reducer along with the built-in ones:

```csharp
builder.Services.AddReducers<MyCardanoDbContext, IReducerModel>([
    typeof(BlockBySlotReducer<>),
    typeof(MyCustomReducer<>)
]);
```
