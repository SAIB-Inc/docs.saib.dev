---
title: Architecture
sidebar_position: 5
---


# Architecture Overview

---

This guide explains the architecture of Argus, helping you understand how the different components fit together and how data flows through the system.

&nbsp;

:::tip
Understanding Argus's architecture will help you make better decisions when building custom reducers and integrating with other systems.
:::

## 🏗️ High-Level Architecture

Argus follows a modular architecture designed to efficiently process Cardano blockchain data. At a high level, the system consists of these key components:

&nbsp;

```
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│  Cardano Node   │──▶ │  Chain Provider │──▶ │CardanoIndexWorker│
└─────────────────┘    └─────────────────┘    └────────┬─────────┘
                                                      ┌─┴─┐
                                            ┌─────────┤   ├─────────┐
                                            ▼         │   │         ▼
                                     ┌────────────┐   │   │   ┌────────────┐
                                     │  Reducer 1 │◀──┘   └──▶│  Reducer 2 │
                                     └────┬───────┘           └────┬───────┘
                                          │                        │
                                          ▼                        ▼
                                    ┌─────────────────────────────────────┐
                                    │            Database                 │
                                    └─────────────────────────────────────┘
```

---

## 🧩 Core Components

### 1. Chain Provider

The Chain Provider is responsible for connecting to the Cardano blockchain and streaming blocks:

&nbsp;


```csharp
public interface ICardanoChainProvider
{
    IAsyncEnumerable<NextResponse> StartChainSyncAsync(
        IEnumerable<Point> intersection, 
        ulong networkMagic = 2, 
        CancellationToken? stoppingToken = null);
    
    Task<Point> GetTipAsync(
        ulong networkMagic = 2, 
        CancellationToken? stoppingToken = null);
}
```

Argus includes two implementations:

* 🔌 **N2CProvider**: Connects directly to a Cardano node via Unix socket
* 🌐 **U5CProvider**: Connects to a Cardano node via gRPC (like Demeter's UTXO RPC)

:::info
The Provider pattern allows you to switch between different connection methods without changing your application code.
:::

### 2. CardanoIndexWorker

The CardanoIndexWorker is the orchestrator that manages the synchronization process:

* 🔗 **Connection Management**: Connects to the Cardano blockchain using the configured provider
* 📝 **State Tracking**: Tracks synchronization progress in the database
* 📦 **Block Dispatching**: Dispatches blocks to the appropriate reducers
* 🔄 **Rollback Handling**: Handles chain reorganizations (rollbacks)
* 📊 **Monitoring**: Provides monitoring and visualization

:::tip
The CardanoIndexWorker is implemented as a `BackgroundService`, making it easy to integrate with ASP.NET Core applications.
:::

### 3. Reducers

Reducers are the workhorses of Argus, responsible for:

&nbsp;

* 🔍 **Data Processing**: Processing blockchain data according to application-specific rules
* 🔎 **Data Extraction**: Extracting relevant information from blocks and transactions
* 💾 **Persistence**: Storing processed data in the database
* 🛡️ **Rollback Support**: Handling chain reorganizations by reverting data

Each reducer implements this interface:

&nbsp;

```csharp
public interface IReducer<out T> where T : IReducerModel
{
    // Process new blocks
    Task RollForwardAsync(Block block);
    
    // Handle chain reorganizations
    Task RollBackwardAsync(ulong slot);
}
```

:::warning
Reducers must correctly implement both `RollForwardAsync` and `RollBackwardAsync` to ensure data consistency during chain reorganizations.
:::

### 4. Database Context

The database context manages the connection to the PostgreSQL database using Entity Framework Core:

* 🧩 Inherits from `CardanoDbContext`
* 📝 Defines entity models and relationships
* 🔄 Tracks reducer state for synchronization
* 🔍 Provides data access for application-specific queries

---

## 🔄 Data Flow

Argus processes blockchain data through several stages:

### 1. Chain Synchronization

1. The `CardanoIndexWorker` retrieves the last processed point for each reducer
2. It passes these points to the chain provider to find intersection with the blockchain
3. The chain provider streams blocks from the intersection point forward

```csharp
// From CardanoIndexWorker.cs
ICardanoChainProvider chainProvider = GetCardanoChainProvider();
await foreach (NextResponse nextResponse in chainProvider.StartChainSyncAsync(
    intersections, _networkMagic, stoppingToken))
{
    // Process blocks...
}
```

### 2. Block Processing

1. For each block, the `CardanoIndexWorker` calls `RollForwardAsync` on all registered reducers
2. Each reducer extracts the data it's interested in and stores it in the database
3. The worker updates the reducer state with the newest processed point

```csharp
// Process a new block
Task reducerTask = nextResponse.Action switch
{
    NextResponseAction.RollForward => ProcessRollforwardAsync(reducer, nextResponse),
    NextResponseAction.RollBack => ProcessRollbackAsync(reducer, nextResponse, rollbackMode, stoppingToken),
    _ => throw new Exception($"Next response error received. {nextResponse}"),
};

await reducerTask;
```

:::info
Blocks are processed sequentially to maintain data consistency, but multiple reducers can process the same block in parallel.
:::

### 3. Chain Reorganization Handling

1. When a rollback occurs, the chain provider sends a `RollBack` response
2. The `CardanoIndexWorker` calculates the rollback slot and calls `RollBackwardAsync` on each reducer
3. Each reducer removes or reverts data after the rollback slot
4. The worker updates the reducer state to reflect the new chain tip

```csharp
// Handle a rollback
public async Task RollBackwardAsync(ulong slot)
{
    using var dbContext = dbContextFactory.CreateDbContext();
    
    // Remove affected data
    dbContext.MyEntitySet.RemoveRange(
        dbContext.MyEntitySet
            .AsNoTracking()
            .Where(e => e.Slot >= slot)
    );
    
    await dbContext.SaveChangesAsync();
}
```

:::warning
Chain reorganizations (rollbacks) are a normal part of blockchain operation. Your reducers must handle them correctly to maintain data consistency.
:::

### 4. State Management

Argus maintains the state of each reducer in the database:

```
┌─────────────────────────────────────────────────────────────┐
│                       ReducerState                           │
├─────────────┬───────────────┬───────────────────────────────┤
│ Name        │ CreatedAt     │ LatestIntersections           │
├─────────────┼───────────────┼───────────────────────────────┤
│ BlockReducer│ 2023-06-15... │ [{Hash: "abc...", Slot: 123}] │
│ TxReducer   │ 2023-06-15... │ [{Hash: "def...", Slot: 123}] │
└─────────────┴───────────────┴───────────────────────────────┘
```

This ensures that:

* Each reducer can track its own progress independently
* After a restart, synchronization resumes from the last processed point
* Multiple intersections are stored to handle rollbacks efficiently

---

## 🧠 Key Abstractions

Argus is built around several key abstractions that make it flexible and extensible:

### 1. Point

A `Point` represents a specific location on the blockchain:

```csharp
public record Point(
    string Hash,  // Block hash
    ulong Slot    // Slot number
);
```

Points are used to:

* 📌 Track synchronization progress
* 🔍 Find intersection with the blockchain
* 🎯 Identify rollback targets

### 2. NextResponse

A `NextResponse` represents a response from the chain provider:

```csharp
public record NextResponse(
    NextResponseAction Action,       // RollForward or RollBack
    RollBackType? RollBackType,      // Inclusive or Exclusive
    Chrysalis.Cbor.Types.Cardano.Core.Block Block  // Block data
);
```

This abstraction simplifies the handling of different blockchain events.

:::info
The `NextResponseAction` can be either `RollForward` (for new blocks) or `RollBack` (for chain reorganizations).
:::

### 3. IReducerModel

The `IReducerModel` interface marks classes that can be used with reducers:

```csharp
public interface IReducerModel;
```

While simple, this interface creates a contract for models that can be processed by reducers.

### 4. ReducerState

The `ReducerState` record tracks the state of each reducer:

```csharp
public record ReducerState(string Name, DateTimeOffset CreatedAt)
{
    public string LatestIntersectionsJson { get; set; } = string.Empty;
    public string StartIntersectionJson { get; set; } = string.Empty;
    
    [NotMapped]
    public Point StartIntersection { get; set; }
    
    [NotMapped]
    public IEnumerable<Point> LatestIntersections { get; set; }
}
```

This allows Argus to resume synchronization after restarts and handle rollbacks correctly.

---

## 📐 Design Patterns

Argus employs several design patterns to create a flexible and maintainable architecture:

### 1. Provider Pattern

The Chain Provider abstracts the details of blockchain communication, allowing different connection methods (Unix socket, gRPC) to be used interchangeably.

```csharp
// From CardanoIndexWorker.cs
ICardanoChainProvider provider = _connectionType switch
{
    "UnixSocket" => new N2CProvider(_socketPath),
    "gRPC" => new U5CProvider(_gRPCEndpoint, _apiKey),
    _ => throw new Exception("Invalid connection type")
};
```

:::tip
The Provider Pattern makes it easy to add new connection methods or switch between existing ones without changing your application code.
:::

### 2. Repository Pattern

Entity Framework Core implements the repository pattern, abstracting database access behind DbSet properties:

```csharp
public DbSet<BlockInfo> Blocks => Set<BlockInfo>();
```

This pattern:

* 🧩 Separates data access logic from business logic
* 🧪 Makes testing easier through mocking
* 🔍 Provides a consistent way to access data

### 3. Dependency Injection

Argus leverages .NET's dependency injection system to:

* 📦 Register services in a central location
* 🔄 Manage object lifetimes
* 🧪 Simplify testing through abstractions

```csharp
// From Program.cs
builder.Services.AddCardanoIndexer<MyDbContext>(builder.Configuration);
builder.Services.AddReducers<MyDbContext, IReducerModel>([typeof(BlockReducer)]);
```

:::info
Dependency Injection is a key part of ASP.NET Core's architecture and makes it easy to manage service dependencies.
:::

### 4. Observer Pattern

The chain synchronization process follows the observer pattern:

* 📡 The chain provider delivers blockchain events (blocks, rollbacks)
* 📦 The CardanoIndexWorker distributes these events to registered reducers
* 🔄 Reducers react to these events by processing data

This pattern:

* 🔄 Decouples event generation from event handling
* 🧩 Allows multiple reducers to process the same events
* 🔌 Makes it easy to add or remove reducers without changing the core system

---

## 📦 Packages and Dependencies

Argus relies on several key packages:

* **Chrysalis.Cbor**: Handles CBOR serialization for Cardano data structures
* **Chrysalis.Network**: Implements Ouroboros mini-protocols
* **Entity Framework Core**: ORM for database operations
* **Spectre.Console**: Rich terminal user interface for dashboards
* **Utxorpc.Sdk**: Client for UTXO RPC services


:::info
CBOR (Concise Binary Object Representation) is the binary format used by Cardano for data serialization.
:::

---

## 🔍 Extension Points

Argus is designed to be extended in several ways:

### 1. Custom Reducers

The most common extension point is creating custom reducers to process specific blockchain data:

```csharp
public class MyCustomReducer : IReducer<MyCustomModel>
{
    private readonly IDbContextFactory<MyDbContext> _dbContextFactory;

    public MyCustomReducer(IDbContextFactory<MyDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task RollForwardAsync(Block block)
    {
        // Extract and process data...
    }

    public async Task RollBackwardAsync(ulong slot)
    {
        // Handle rollbacks...
    }
}
```

:::tip
Start with a focused reducer that processes only the data you need. You can always add more reducers later to extract additional information.
:::

### 2. Custom Providers

You can implement your own `ICardanoChainProvider` to connect to Cardano in different ways:

```csharp
public class MyCustomProvider : ICardanoChainProvider
{
    public async IAsyncEnumerable<NextResponse> StartChainSyncAsync(
        IEnumerable<Point> intersection,
        ulong networkMagic = 2,
        CancellationToken? stoppingToken = null)
    {
        // Implementation...
    }

    public async Task<Point> GetTipAsync(
        ulong networkMagic = 2,
        CancellationToken? stoppingToken = null)
    {
        // Implementation...
    }
}
```

### 3. Enhanced Entity Models

You can create rich entity models that build on Argus's basic structures:

```csharp
public record EnhancedBlockInfo(
    string Hash,
    ulong Slot,
    bool IsMainChain,
    ICollection<TransactionInfo> Transactions
) : IReducerModel;
```

:::info
Entity models can be as simple or as complex as your application requires. They can include relationships to other entities, computed properties, and more.
:::

---

## 🔌 Integration Points

Argus is designed to integrate with other systems:

### 1. ASP.NET Core

Argus can be hosted within an ASP.NET Core application to provide API access to indexed data:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add Argus services
builder.Services.AddCardanoIndexer<MyDbContext>(builder.Configuration);
builder.Services.AddReducers<MyDbContext, IReducerModel>([typeof(BlockReducer)]);

// Add API controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
// ... configure HTTP pipeline
app.Run();
```

:::tip
This is the most common deployment scenario for Argus, as it allows you to expose your indexed data through RESTful APIs.
:::

### 2. Background Service

Argus can run as a standalone background service:

```csharp
// Program.cs in a Worker Service project
IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        // Add Argus services
        services.AddCardanoIndexer<MyDbContext>(context.Configuration);
        services.AddReducers<MyDbContext, IReducerModel>([typeof(BlockReducer)]);
    })
    .Build();

await host.RunAsync();
```

This approach is useful for:

* 🔄 Dedicated indexing services
* 📦 Containerized deployments
* 🤖 Headless operations

---

## 📊 Monitoring and Visualization

Argus includes built-in monitoring through the CardanoIndexWorker:

* 📊 **Terminal UI**: Real-time visualization of sync progress
* 📈 **Progress Tracking**: Percentage complete for each reducer
* 💻 **Resource Monitoring**: CPU and memory usage tracking
* 📝 **Logging**: Structured logging of events and errors


:::info
You can configure the monitoring dashboard in the `appsettings.json` file:

```json
"Sync": {
  "Dashboard": {
    "TuiMode": true,
    "RefreshInterval": 5000,
    "DisplayType": "full"
  }
}
```
:::

---

## 📚 Next Steps

Now that you understand Argus's architecture, you can:

1. 🧠 Explore [Core Concepts](../core-concepts/cardano-basics.md) to understand the fundamental principles
2. 🔌 Learn about [Connection Types](../connections/index.md) in more detail
3. 🔄 Understand how [Chain Synchronization](../core-concepts/chain-sync.md) works
4. 🛠️ Start [Creating Custom Reducers](../guides/create-custom-reducer.md) for your specific needs

---

With a solid understanding of Argus's architecture, you're well-equipped to build powerful Cardano blockchain applications.