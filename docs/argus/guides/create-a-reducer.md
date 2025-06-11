---
title: Create a Reducer
sidebar_position: 1
hide_title: true
---

![Argus Creater Reducer Banner](/img/docs/argus/guides/argus-create-reducer-banner.webp)

This guide will walk you through the process of setting up and using Argus, from installation to running your first blockchain indexer application. You'll learn how to transform raw Cardano blockchain data into structured database records that can be easily queried and analyzed.

---

## Prerequisites

Before getting started, ensure you have the following:

| Tool / Library                                 | Install link                                                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **.NET SDK** ≥ 9.0                             | [.NET downloads](https://dotnet.microsoft.com/download)                                                           |
| **PostgreSQL** ≥ 14                            | [PostgreSQL downloads](https://www.postgresql.org/download/)                                                      |
| **Access to a Cardano node (local or remote)** | [Cardano Developer Portal](https://developers.cardano.org/docs/get-started/cardano-node/installing-cardano-node/) |

:::tip Environment Setup
If you don't have a local Cardano node, you can use remote node services like those offered by Demeter.run. This guide works with both local and remote node options.
:::

---

## Overview of Argus

Argus is a blockchain indexing framework that transforms raw Cardano blockchain data into structured database records. Before diving into the implementation details, here's a high-level overview of how Argus works:

### Key Components

1. **Data Models** - Define what blockchain data you want to extract and store
2. **Database Context** - Provides persistence and entity configuration
3. **Reducers** - Convert blockchain data into your application-specific models
4. **Configuration** - Connect to a Cardano node and set synchronization parameters
5. **Services** - Register and configure the components for automatic operation

Argus simplifies blockchain data processing by connecting to a Cardano node, reading blockchain data, processing it through reducers, and storing results in your database. The framework handles synchronization tracking, chain rollbacks, and data integrity automatically. By following this guide, you'll create a complete indexing application customized to your specific data needs.

---

## Step-by-Step Guide

### 1. Install Required Packages

First, create a new .NET project and add the necessary packages:

```bash
# Create a new web application
dotnet new web -n ArgusExample

# Navigate to the project directory
cd ArgusExample

# Install the main package
dotnet add package Argus.Sync --version 0.3.4-alpha

# Required dependencies
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

#### What are these packages for?

These packages supply all the necessary tools to connect with a Cardano node, handle blockchain data processing, and save the data in a PostgreSQL database:

- **Argus.Sync**: The core library that provides blockchain indexing functionality.
- **Microsoft.EntityFrameworkCore.Design**: Required for EF Core migrations and database schema generation.
- **Npgsql.EntityFrameworkCore.PostgreSQL**: PostgreSQL provider for Entity Framework Core.

### 2. Define Your Data Models

Create models that represent the blockchain data you want to store:

```csharp
using Argus.Sync.Data.Models;

// Define your model
public record BlockInfo(
    string Hash,       // Block hash
    ulong Number,      // Block number
    ulong Slot,        // Block slot number
) : IReducerModel;
```

:::info What is IReducerModel?
The `IReducerModel` interface is a marker interface in Argus that your data models must inherit from to be used with the framework. While it doesn't define any methods or properties, this inheritance is required for your models to be properly integrated with the Argus reducers system.
:::

### 3. Set Up Database Context

Create a database context to manage your models:

```csharp
using Argus.Sync.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class MyDbContext(
    DbContextOptions options,
    IConfiguration configuration
) : CardanoDbContext(options, configuration)
{
    public DbSet<BlockInfo> Blocks => Set<BlockInfo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BlockInfo>(entity =>
        {
            entity.HasKey(e => e.Hash);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("now()");
        });
    }
}
```

:::info What is CardanoDbContext?
The `CardanoDbContext` is a specialized Entity Framework Core `DbContext` that needs to be inherited by your database context. This inheritance provides the essential Argus framework integration, allowing your database to interact with the blockchain data processing pipeline.

We connect to our database schema by defining a DbSet, which corresponds to the `BlockInfo` model we created earlier.
:::

### 4. Implement Reducers

Create reducers that process blockchain data:

```csharp
using Argus.Sync.Reducers;
using Chrysalis.Cbor.Types.Cardano.Core;
using Microsoft.EntityFrameworkCore;

public class BlockReducer(IDbContextFactory<MyDbContext> dbContextFactory)
    : IReducer<BlockInfo>
{
    public async Task RollForwardAsync(Block block)
    {
        // Extract block data
        string hash = block.Header().Hash();
        ulong number = block.Header().HeaderBody().BlockNumber();
        ulong slot = block.Header().HeaderBody().Slot();

        // Store in database
        using var db = dbContextFactory.CreateDbContext();
        db.Blocks.Add(new BlockInfo(hash, number, slot, DateTime.UtcNow));
        await db.SaveChangesAsync();
    }

    public async Task RollBackwardAsync(ulong slot)
    {
        // Remove any blocks at or after the rollback slot
        using var db = dbContextFactory.CreateDbContext();
        db.Blocks.RemoveRange(
            db.Blocks.Where(b => b.Slot >= slot)
        );
        await db.SaveChangesAsync();
    }
}
```

:::info What is IReducer?
The `IReducer<T>` interface is at the core of Argus' data processing pipeline. It defines how blockchain data is transformed and stored in your database. The `T` in `IReducer<T>` is your model type that implements `IReducerModel`.
:::

#### Required Methods

`IReducer<T>` requires implementing two key methods:

| Method                | Purpose                                                                                                                          | Parameters     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **RollForwardAsync**  | Called when new blocks are discovered, allowing you to extract and store blockchain data.                                        | `Block` object |
| **RollBackwardAsync** | Called during chain rollbacks, enabling you to remove or update data from blocks that are no longer part of the canonical chain. | `ulong slot`   |

By implementing these methods, your reducer actively tracks the evolving state of the blockchain. Together, they provide a robust mechanism to keep your database synchronized with the canonical chain, enabling reliable and up-to-date blockchain data management.

### 5. Configure Application Settings

Argus requires specific configuration settings to connect to a Cardano node and manage synchronization. Create an `appsettings.json` file with the following key sections:

- **ConnectionStrings**: Database connection information
- **CardanoNodeConnection**: Settings for connecting to the Cardano node
- **Sync**: Configuration for the synchronization process

For detailed explanation of all configuration options, see the [Configuration Guide](/docs/argus/getting-started/configuration.md).

```json
{
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=argus;Username=postgres;Password=password;Port=5432",
    "CardanoContextSchema": "cardanoindexer"
  },
  "CardanoNodeConnection": {
    "ConnectionType": "UnixSocket",
    "UnixSocket": {
      "Path": "/path/to/node.socket"
    },
    "NetworkMagic": 764824073,
    "MaxRollbackSlots": 1000,
    "RollbackBuffer": 10,
    "Slot": 139522569,
    "Hash": "3fd9925888302fca267c580d8fe6ebc923380d0b984523a1dfbefe88ef089b66"
  },
  "Sync": {
    "Dashboard": {
      "TuiMode": true,
      "RefreshInterval": 5000,
      "DisplayType": "sync"
    }
  }
}
```

:::tip Connection Options
Argus supports multiple connection methods:

1. **UnixSocket**: Direct connection to a local node (fastest option)
2. **gRPC**: Connection to a remote node via UtxoRPC (easiest to set up)
3. **TCP**: Network connection to a remote node (traditional approach)

Choose the option that works best for your environment.
:::

### 6. Register Services

Register Argus services in your `Program.cs`:

```csharp
using Argus.Sync.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Register Argus services
builder.Services.AddCardanoIndexer<MyDbContext>(builder.Configuration);
builder.Services.AddReducers<MyDbContext, IReducerModel>(builder.Configuration);

var app = builder.Build();
app.Run();
```

#### Extension Methods

These two extension methods connect all the components you've created:

| Method                | Purpose                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| **AddCardanoIndexer** | Configures database connection, node connection, and synchronization services |
| **AddReducers**       | Registers your reducers and connects them to your data models                 |

These methods automate the wiring of components, allowing you to focus on your custom data models and reducers rather than infrastructure setup.

### 7. Create and Apply Migrations

Generate and apply Entity Framework migrations:

```bash
# Create the initial migration
dotnet ef migrations add InitialMigration

# Apply the migration to the database
dotnet ef database update
```

:::warning Database Access
Ensure your PostgreSQL server is running and accessible with the credentials specified in your connection string before running these commands.
:::

### 8. Run Your Application

Start your application to begin synchronizing with the blockchain:

```bash
dotnet run
```

:::tip Synchronization Progress
When your application starts, you'll see the Argus dashboard in your terminal showing synchronization progress. Initial synchronization from the genesis block can take substantial time, so consider starting from a more recent block using the `Slot` and `Hash` settings in your configuration.
:::

---

## Argus Integration Best Practices

### Effective Reducer Design

**Use slot-based tracking**:

```csharp
// Store the slot with each record for rollback support
public record TokenTransfer(
    string TxHash,
    int TxIndex,
    ulong Slot,      // Critical for chain rollback handling
    string PolicyId,
    string AssetName,
    string FromAddress,
    string ToAddress,
    ulong Amount,
    ulong Lovelace
) : IReducerModel;
```

:::info Rollback Handling
Storing the block slot with each record is essential for Argus's chain rollback handling:

- Slot numbers uniquely identify blockchain positions
- During rollbacks, Argus provides the exact slot to roll back to
- All records with slots greater than the rollback point must be reversed
  :::

Storing the block slot with each record is crucial for Argus’s effective chain rollback management, as slot numbers uniquely mark blockchain positions. This allows Argus to precisely identify rollback points and reverse all records from slots beyond the rollback, ensuring accurate state restoration.

**Maintain data integrity with Argus’s transactional processing:**

```csharp
public async Task RollForwardAsync(Block block)
{
    using var db = dbContextFactory.CreateDbContext();

    // Process all operations within the same transaction
    foreach (var tx in block.TransactionBodies())
    {
        ProcessInputs(db, tx);
        ProcessOutputs(db, tx);
        ProcessMetadata(db, tx);
    }

    await db.SaveChangesAsync();
}
```

:::info Transaction Consistency
Argus provides important transaction guarantees:

- Each block is processed in an isolated transaction
- All your reducers are synchronized to maintain cross-entity consistency
  :::

Argus ensures robust transaction guarantees by processing each block within an isolated transaction and synchronizing all reducers to maintain consistent state across multiple entities. This approach provides reliable and consistent data handling essential for blockchain applications.

### Argus-Specific Data Patterns

**Use active-historical architecture for Cardano's UTxO model:**

```csharp
// Active state
public class ActiveUtxo
{
    public string TxHash { get; set; }  // Transaction hash
    public int Index { get; set; }      // Output index
    public string Address { get; set; } // Owner address
    public long Lovelace { get; set; }  // ADA amount in lovelace
    public string[] Assets { get; set; } // Native tokens
    public ulong Slot { get; set; } // Block slot
}

// Historical state
public class HistoricalUtxo
{
    public string TxHash { get; set; }
    public int Index { get; set; }
    public string OutRef { get; set; } // Consumed UTxO
    public string Address { get; set; }
    public long Lovelace { get; set; }
    public string[] Assets { get; set; }
    public ulong Slot { get; set; }
}
```

:::info Dual-State Architecture
This dual-state approach aligns perfectly with Cardano's UTxO model:

- **Active State**: Tracks the current UTxO (Unspent Transaction Output)
- **History State**: Records a transaction that has been executed
  :::

This dual-state approach complements Cardano’s UTxO model by maintaining an Active State for tracking current unspent outputs and a History State for recording completed transactions, ensuring accurate and efficient ledger management.
