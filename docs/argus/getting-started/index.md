---
title: Argus Overview
sidebar_position: 1
hide_title: true
---

![Argus Banner](/img/docs/argus/getting-started/argus.png)

---

## What is Argus?

Argus is a .NET library that simplifies interactions with the Cardano blockchain by providing an efficient indexing framework. It processes block data into structured, queryable formats stored in a database, making blockchain data easier to work with for .NET developers.

:::info 🎬 Video Tutorial
For a detailed explanation and demo of Argus, check out [this video walkthrough](https://x.com/clarkalesna/status/1859042521856532883)!
:::

---

## Key Components

Argus is built around several core components that work together to provide a complete indexing solution:

- **Blockchain Indexing** - Transform raw blockchain data into structured database records
- **Reducers** - Define the transformation logic for blockchain data
- **Chain Providers** - Connect to Cardano nodes through various protocols
- **CardanoIndexWorker** - Coordinates the synchronization process
- **CardanoDbContext** - Manages database operations via Entity Framework Core

---

## Features

- **Customizable Reducers** - Define exactly how blockchain data should be processed and stored
- **Flexible Connectivity Options** - Connect to Cardano in the way that suits you best
- **Robust Rollback Handling** - Ensure data consistency when blockchain reorganizations occur
- **Comprehensive Monitoring** - Track indexing progress with built-in dashboard
- **Developer-Friendly Integration** - Built for .NET developers with full Entity Framework Core support

---

## How Argus Works

Argus follows a straightforward yet powerful pattern to process blockchain data:

1. **Connect** to a Cardano node using one of the available providers
2. **Sync** with the blockchain to receive blocks in real-time
3. **Process** blocks through your custom reducers to extract and transform data
4. **Store** the processed data in your database for easy querying
5. **Handle** chain reorganizations automatically to maintain data consistency

The heart of Argus is the reducer pattern, which gives you full control over data processing:

```csharp
public class BlockReducer : IReducer<BlockInfo>
{
    public async Task RollForwardAsync(Block block)
    {
        // Extract data from the block
        string hash = block.Header().Hash();
        ulong slot = block.Header().HeaderBody().Slot();

        // Store it in your database
        using var db = dbContextFactory.CreateDbContext();
        db.Blocks.Add(new BlockInfo(hash, slot, DateTime.UtcNow));
        await db.SaveChangesAsync();
    }

    public async Task RollBackwardAsync(ulong slot)
    {
        // Handle rollbacks when chain reorganizations occur
        using var db = dbContextFactory.CreateDbContext();
        db.Blocks.RemoveRange(db.Blocks.Where(b => b.Slot >= slot));
        await db.SaveChangesAsync();
    }
}
```

---

## Architecture

Argus consists of several specialized components working together:

| Component              | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| **Chain Providers**    | Connect to the Cardano blockchain through various protocols |
| **Reducers**           | Process and transform blockchain data                       |
| **CardanoIndexWorker** | Manages the synchronization process                         |
| **CardanoDbContext**   | Base context for database operations                        |

#### Chain Providers

Chain providers are the connection layer between Argus and the Cardano blockchain. They abstract the underlying communication protocols:

- **N2CProvider (UnixSocket)**: Implements Ouroboros mini-protocols directly over Unix sockets for local node connections
- **U5CProvider (gRPC)**: Uses UtxoRPC to connect to remote Cardano nodes via gRPC, ideal for cloud deployments
- **N2NProvider (TCP)**: Implements Ouroboros mini-protocols over TCP/IP connections

The modular design allows for new providers to be added when new connection methods become available. Custom providers can be implemented by extending the `ICardanoChainProvider` interface, making Argus adaptable to future Cardano network developments.

![Argus Architecture](/img/docs/argus/getting-started/argus_architecture.png)

---

##  Performance

Performance is critical for blockchain applications that need to process large volumes of data efficiently. Argus has been engineered with performance as a central design principle:

#### Processing Efficiency

Argus achieves high-performance blockchain data processing through:

- **Optimized Data Pipeline** - Streamlined flow from blockchain to database
- **Connection Pooling** - Efficient database connection management
- **Strategic Parallelization** - Parallel processing where it provides the most benefit
- **Memory-Efficient Handling** - Careful management of resources during processing

#### Database Integration

By leveraging Entity Framework Core, Argus provides powerful data access capabilities:

- **Efficient Querying** - LINQ expressions compiled to optimized SQL
- **Relationship Management** - Eager, lazy, and explicit loading of related data
- **Advanced Data Operations** - Support for complex filtering, sorting, and pagination
- **Projections and Aggregations** - Retrieve exactly the data you need in the format you need it

---

##  What Can You Build with Argus?

Argus serves as a foundation for building a wide range of blockchain applications. Here are some of the key use cases that Argus is particularly well-suited for:

#### Financial Applications

- **DeFi Analytics Platforms**  
  Monitor liquidity pools, track yield farming opportunities, and analyze trading volumes across Cardano DeFi protocols

- **Trading Intelligence Tools**  
  Provide real-time insights into market movements, token valuations, and transaction patterns

#### Digital Asset Management

- **NFT Marketplaces & Galleries**  
  Track ownership history, monitor floor prices, and identify trading patterns across collections

- **Asset Portfolio Trackers**  
  Create comprehensive views of digital asset holdings with historical performance metrics

#### Blockchain Infrastructure

- **Smart Contract Monitoring**  
  Track specific contract executions, monitor protocol health, and detect anomalies in transaction patterns

- **Wallet Analytics Services**  
  Provide insights into wallet activity, transaction history, and asset movements

#### Enterprise Solutions

- **Supply Chain Traceability**  
  Track asset movements with verified blockchain records for supply chain transparency

- **Custom Analytics Platforms**  
  Build specialized data pipelines for particular business needs with Cardano blockchain data


