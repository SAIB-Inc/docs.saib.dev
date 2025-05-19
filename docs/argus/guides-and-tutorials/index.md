---
title: Guides
sidebar_position: 1
---

# 🚀 Guides

This guide will walk you through the process of setting up and using Argus, from installation to running your first blockchain indexer application. You'll learn how to transform raw Cardano blockchain data into structured database records that can be easily queried and analyzed.

## 📋 Prerequisites

Before getting started, ensure you have the following:
```
- .NET 8.0 SDK or later installed
- PostgreSQL database installed and running
- Access to a Cardano node (local or remote)
```

:::tip Environment Setup
If you don't have a local Cardano node, you can use remote node services like those offered by Demeter.run. This guide works with both local and remote node options.
:::

## 🔍 Step-by-Step Guide

### 1️⃣ Install Required Packages

First, create a new .NET project and add the necessary packages:

```bash
# Create a new web application
dotnet new web -n ArgusExample

# Navigate to the project directory
cd ArgusExample

# Install the main package
dotnet add package Argus.Sync --version 0.3.1-alpha

# Required dependencies
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

<details>
<summary>What are these packages for?</summary>

- **Argus.Sync**: The core library that provides blockchain indexing functionality
- **Microsoft.EntityFrameworkCore.Design**: Required for EF Core migrations and database schema generation
- **Npgsql.EntityFrameworkCore.PostgreSQL**: PostgreSQL provider for Entity Framework Core

These packages provide everything you need to connect to a Cardano node, process blockchain data, and store it in a PostgreSQL database.
</details>

### 2️⃣ Define Your Data Models

Create models that represent the blockchain data you want to store:

```csharp
using Argus.Sync.Data.Models;

// Define your model
public record BlockInfo(
    string Hash,       // Block hash
    ulong Number,      // Block number
    ulong Slot,        // Block slot number
    DateTime CreatedAt // Timestamp
) : IReducerModel;
```

:::info What is IReducerModel?
The `IReducerModel` interface is a marker interface in Argus that identifies classes that can be processed by reducers. By implementing this interface:

- **Automatic Discovery**: Your model becomes eligible for automatic discovery by Argus's dependency injection system
- **Reducer Processing**: It can be processed by reducers that implement `IReducer<T>` where T is your model
- **Chain Consistency**: It enables Argus to maintain consistency during chain rollbacks
:::

#### Chain Rollback Handling

One of the most critical aspects of blockchain indexing is handling chain rollbacks, which occur when the blockchain temporarily forks and then resolves to a single chain. During a rollback:

1. Some previously confirmed blocks become invalidated
2. New blocks from the winning chain need to be processed
3. Any data derived from invalidated blocks must be rolled back

By implementing `IReducerModel`, your data model becomes part of Argus's systematic approach to handling these rollbacks:

- The framework tracks which models need to be updated during rollbacks
- It correctly orders operations to maintain referential integrity
- It ensures your database state accurately reflects the current blockchain state
- It connects your models to their appropriate reducers for both forward and backward operations

:::important
This is why the `BlockReducer` implements both `RollForwardAsync` and `RollBackwardAsync` methods - to properly handle chain rollbacks while maintaining data consistency.

While `IReducerModel` doesn't define any methods or properties (it's a marker interface), it's essential for the Argus framework to identify which models should be integrated into the blockchain data processing pipeline.
:::

### 3️⃣ Set Up Database Context

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
The `CardanoDbContext` is a specialized Entity Framework Core `DbContext` provided by Argus that serves as the foundation for Cardano blockchain data indexing. When you inherit from it, your database context gains several important capabilities:

- **Chain Tracking**: Built-in infrastructure to track blockchain state and synchronization progress
- **Transaction Management**: Specialized handling for blockchain-specific operations and rollbacks
- **Schema Management**: Automatic setup and maintenance of system tables required by Argus
- **Configuration Integration**: Seamless connection with Argus configuration settings
:::

#### Implementation Requirements

In your custom DbContext implementation:

- Define `DbSet<T>` properties for each model you want to store and query
- Override `OnModelCreating` to configure your entity relationships and constraints
- Always call the base class implementation with `base.OnModelCreating(modelBuilder)` to ensure proper setup

:::note
Argus manages transaction boundaries during blockchain synchronization, helping maintain data consistency even during chain rollbacks.
:::

### 4️⃣ Implement Reducers

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

<details>
<summary>Understanding the Block Processing Flow</summary>

1. When a new block is discovered in the blockchain, Argus calls `RollForwardAsync`
2. The reducer extracts key information from the block header
3. It creates a new record in the database with this information
4. When a chain reorganization occurs, Argus calls `RollBackwardAsync`
5. The reducer removes any records that came from invalidated blocks
6. This ensures your database always reflects the canonical chain

This pattern applies to all reducers, regardless of what specific blockchain data they process.
</details>

:::info What is IReducer?
The `IReducer<T>` interface is at the core of Argus's data processing pipeline. It defines how blockchain data is transformed and stored in your database:

- **Purpose**: Converts raw blockchain data into application-specific models
- **Type Parameter**: The `T` in `IReducer<T>` is your model type that implements `IReducerModel`
- **Integration**: Automatically discovered and registered when you call `AddReducers<TContext, TModel>()` in your service configuration
:::

#### Required Methods

`IReducer<T>` requires implementing two key methods:

| Method | Purpose | Parameters | Responsibility |
|--------|---------|------------|----------------|
| **RollForwardAsync** | Process new blocks | `Block` object | Extract data, transform, and persist |
| **RollBackwardAsync** | Handle chain rollbacks | `ulong slot` | Remove data from invalidated blocks |

#### RollForwardAsync
- Called when processing new blocks from the blockchain
- Receives a `Block` object containing all block data
- Responsible for extracting relevant information
- Transforms raw blockchain data into your domain model
- Persists the data to your database

#### RollBackwardAsync
- Called during chain rollbacks when previously processed blocks become invalid
- Receives a slot number indicating the point to roll back to
- Must remove or update any data derived from blocks at or after the given slot
- Ensures database consistency with the canonical blockchain

#### Example Explained

In the example above:

**Roll Forward Process**
- Extracts the block hash, number, and slot from the block header 
- Creates a new `BlockInfo` record with the extracted data
- Adds it to the database context and saves the changes

**Roll Backward Process**
- Finds all block records with a slot number greater than or equal to the rollback point
- Removes these records from the database
- This ensures that any blocks that are no longer part of the canonical chain are removed

:::important
The combination of these two methods ensures that your database always reflects the current state of the blockchain, even when the chain undergoes rollbacks.
:::

### 5️⃣ Configure Application Settings

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

<details>
<summary>Configuration Options Explained</summary>

**ConnectionStrings**
- `CardanoContext`: Standard PostgreSQL connection string
- `CardanoContextSchema`: Database schema where tables will be created

**CardanoNodeConnection**
- `ConnectionType`: Method for connecting to Cardano (`UnixSocket`, `gRPC`, or `TCP`)
- `UnixSocket.Path`: Path to the node socket for local connections
- `NetworkMagic`: Network identifier (764824073 for mainnet, 1 for preprod, 2 for preview)
- `MaxRollbackSlots`: Maximum number of slots that can be rolled back
- `RollbackBuffer`: Number of recent blocks to keep for potential rollbacks
- `Slot` & `Hash`: Starting point for synchronization (optional)

**Sync**
- `Dashboard.TuiMode`: Enable/disable terminal UI
- `Dashboard.RefreshInterval`: Update frequency in milliseconds
- `Dashboard.DisplayType`: Dashboard visualization mode
</details>

:::tip Connection Options
Argus supports multiple connection methods:

1. **UnixSocket**: Direct connection to a local node (fastest option)
2. **gRPC**: Connection to a remote node via UtxoRPC (easiest to set up)
3. **TCP**: Network connection to a remote node (traditional approach)

Choose the option that works best for your environment.
:::

### 6️⃣ Register Services

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

:::info What are the Extension Methods?
The two extension methods used above are crucial for setting up the Argus indexing framework and making everything work together automatically.
:::

#### Extension Method Overview

| Method | Purpose | Type Parameters |
|--------|---------|----------------|
| **AddCardanoIndexer** | Configure core infrastructure | `<TContext>` - Your database context |
| **AddReducers** | Set up data transformation pipeline | `<TContext, TModel>` - Your context and model marker interface |

#### AddCardanoIndexer

This method configures the core infrastructure required for Cardano blockchain synchronization:

- Registers and configures the database connection using your custom DbContext
- Sets up the connection to the Cardano node based on your appsettings.json configuration
- Initializes the blockchain tip tracking system to maintain synchronization state
- Registers background services that handle the continuous synchronization process
- Configures internal metrics and monitoring capabilities
- Establishes transaction handling mechanisms specific to blockchain operations

#### AddReducers

This method sets up the data transformation pipeline:

- Scans your application for all classes that implement IReducer where T implements IReducerModel
- Automatically registers these reducers with the dependency injection system
- Maps reducers to their respective models for processing
- Configures the processing order to ensure data consistency during synchronization
- Connects reducers to the chain synchronization pipeline

#### Key Benefit

These extension methods work together to create a fully functional Cardano blockchain indexer with minimal code, handling all the complex wiring between your custom logic and the Argus framework.

### 7️⃣ Create and Apply Migrations

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

### 8️⃣ Run Your Application

Start your application to begin synchronizing with the blockchain:

```bash
dotnet run
```

:::tip Synchronization Progress
When your application starts, you'll see the Argus dashboard in your terminal showing synchronization progress. Initial synchronization from the genesis block can take substantial time, so consider starting from a more recent block using the `Slot` and `Hash` settings in your configuration.
:::

## 🧠 Understanding the Process

After following this guide, you've created an Argus indexer application that implements all the key components of blockchain data processing:

1. **Data Models** - Your `IReducerModel` classes define what blockchain data you want to extract and store

2. **Database Context** - Your custom `CardanoDbContext` provides the data persistence layer with proper entity configuration

3. **Reducers** - Your `IReducer<T>` implementations contain the business logic for transforming blockchain data

4. **Infrastructure** - The Argus extension methods handle the complex synchronization process

<details>
<summary>How the Synchronization Process Works</summary>

When you run your Argus application, a sophisticated synchronization process kicks in:

1. **Initialization**: 
   - Argus reads your configuration
   - Establishes a connection to the Cardano node
   - Loads or creates reducer state tracking information in the database

2. **Chain Tip Discovery**:
   - Queries the node to find the current blockchain tip
   - Determines the synchronization starting point based on configuration or existing state

3. **Block Processing**:
   - Fetches blocks sequentially from the starting point
   - For each block, calls `RollForwardAsync` on all registered reducers
   - Maintains internal state tracking for each reducer

4. **Rollback Handling**:
   - Continuously monitors for chain reorganizations
   - When a rollback is detected, calls `RollBackwardAsync` on affected reducers
   - Resumes forward synchronization from the rollback point

5. **Monitoring**:
   - Updates the terminal dashboard with synchronization progress
   - Logs detailed information about the synchronization process
   - Tracks system resources used during synchronization
</details>

When your application runs, this pipeline activates:

- **Initialization**: The application connects to your Cardano node using the configuration provided
- **Synchronization**: Argus starts fetching blocks from the blockchain in sequence
- **Processing**: Each block passes through your reducers via the `RollForwardAsync` method
- **Persistence**: Your extracted and transformed data is stored in the database
- **Consistency**: If chain rollbacks occur, Argus automatically invokes `RollBackwardAsync` to maintain data integrity
- **Monitoring**: The synchronization dashboard shows real-time processing status

## 👣 Next Steps

Now that you understand the core concepts of Argus and have a working indexer, you can expand your application:

### Enhance Your Indexer

- **Additional Reducers**: Create reducers for transactions, outputs, metadata, and other blockchain elements
- **Complex Data Models**: Develop more sophisticated data models with relationships between entities
- **Query Optimization**: Add indexes and optimize your database schema for your specific query patterns

### Build Applications On Your Data

- **REST APIs**: Create endpoints to expose your indexed data to client applications
- **Data Analytics**: Perform aggregations and analytics on the blockchain data
- **Visualizations**: Build dashboards and charts to visualize blockchain activity
- **Event Notifications**: Implement webhooks or notifications for specific blockchain events

### Advanced Features

- **Custom Chain Providers**: Interface with different node implementations or blockchain networks
- **Specialized Reducers**: Process unique on-chain data structures or smart contract outputs
- **Scalability Options**: Configure database sharding and partitioning for high-volume indexing

:::tip Built-in Reducers
Argus includes several built-in reducers for common data types. Check out the [Built-in Reducers Guide](/docs/argus/usage-guides/builtin-reducers.md) to leverage these pre-built components in your application.
:::

For more detailed guidance, check out these resources:

- [Built-in Reducers Guide](/docs/argus/usage-guides/builtin-reducers.md) - Learn about the pre-built reducers available in Argus
- [Cardano Data Structures](/docs/argus/data/cardano-structures.md) - Understand the blockchain data models
- [Applications Guide](/docs/argus/guides-and-tutorials/applications.md) - Examples of building applications with indexed data