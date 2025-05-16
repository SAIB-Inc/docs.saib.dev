---
title: Installation Guide
sidebar_position: 2
description: Comprehensive guide for installing and configuring Argus, a .NET indexing framework for Cardano
---

# Argus Installation Guide

This guide walks you through the complete process of installing and configuring Argus for your Cardano blockchain applications. By following these steps, you'll have a fully functional Argus instance ready to index and process blockchain data.

## System Requirements

Before installing Argus, ensure your development environment meets the following requirements:

### Required Software

| Component | Version | Notes |
|-----------|---------|-------|
| **.NET SDK** | 9.0 or later | [Download .NET](https://dotnet.microsoft.com/download) |
| **PostgreSQL** | 12.0 or later | [Download PostgreSQL](https://www.postgresql.org/download/) |
| **Entity Framework Core** | 8.0 or later | Installed via NuGet |

### Hardware Recommendations

For running Argus itself, the minimum requirements are modest:

- **CPU**: 2+ cores
- **RAM**: 4+ GB
- **Storage**: 50+ GB SSD (depending on indexing scope)
- **Network**: Stable internet connection

:::note Important
These requirements are for Argus alone. If you're running a local Cardano node on the same machine (required for UnixSocket connections), you'll need to account for the node's additional requirements (8+ GB RAM, 4+ cores, 100+ GB storage for mainnet).
:::

:::tip Performance Optimization
Running Argus on the same machine as your Cardano node using the UnixSocket provider significantly improves performance by reducing network latency. If you're using a remote node through gRPC, you won't need to meet the Cardano node hardware requirements locally.
:::

## Installation Process

### 1. Create a New .NET Project

Start by creating a new .NET project if you don't already have one:

```bash
# Create a new ASP.NET Core Web API project
dotnet new webapi -n MyArgusIndexer

# Navigate to the project directory
cd MyArgusIndexer
```

### 2. Add Argus NuGet Packages

Install the Argus library and required dependencies using NuGet:

```bash
# Add the Argus core package
dotnet add package Argus.Sync --version 0.3.1-alpha

# Add Entity Framework Core packages
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

Alternatively, you can add the packages through the Package Manager Console in Visual Studio:

```powershell
Install-Package Argus.Sync -Version 0.3.1-alpha
Install-Package Microsoft.EntityFrameworkCore.Design
Install-Package Npgsql.EntityFrameworkCore.PostgreSQL
```

:::note Package Versions
Always check the [Argus GitHub repository](https://github.com/SAIB-Inc/Argus) for the latest version numbers. Compatibility between packages is essential for proper operation.
:::

## Database Configuration

Argus uses PostgreSQL to store indexed blockchain data. Follow these steps to set up and configure your database.

### 1. Create a PostgreSQL Database

First, create a dedicated PostgreSQL database for your Argus data:

```bash
# Using psql command line
psql -U postgres -c "CREATE DATABASE argus_db;"

# Or using createdb utility
createdb -U postgres argus_db
```

### 2. Configure Connection Strings

Add your database connection details to `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=argus;Username=postgres;Password=password;Port=5432",
    "CardanoContextSchema": "cardanoindexer"
  }
}
```

#### Connection String Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `Host` | PostgreSQL server hostname or IP | `localhost`, `192.168.1.100` |
| `Database` | Name of your PostgreSQL database | `argus_db` |
| `Username` | Database user with proper permissions | `postgres` |
| `Password` | The user's password | `your_password` |
| `Port` | PostgreSQL server port | `5432` (default) |
| `CardanoContextSchema` | Database schema to use | `public` (default) |

:::caution Security Warning
Never commit sensitive credentials to source control. For production environments, use environment variables, user secrets, or a secure key vault service.
:::

## Connecting to Cardano

Argus provides multiple ways to connect to the Cardano blockchain. Choose the one that best fits your use case.

### 1. Configure Node Connection

Add your Cardano node connection details to `appsettings.json`:

```json
{
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

### 2. Connection Provider Options

Argus supports three main connection types, each with its own advantages:

#### gRPC Provider (U5CProvider)

```json
"ConnectionType": "gRPC",
"gRPC": {
  "Endpoint": "https://cardano-preview.utxorpc-m1.demeter.run",
  "ApiKey": "your_api_key"
}
```

- **Best for**: Cloud deployments, remote connections
- **Advantages**: No need to run your own Cardano node
- **Considerations**: Requires API key, potentially higher latency

#### Unix Socket Provider (N2CProvider)

```json
"ConnectionType": "UnixSocket",
"UnixSocket": {
  "SocketPath": "/path/to/node.socket"
}
```

- **Best for**: Local development, production deployments with direct node access
- **Advantages**: Highest performance, direct node communication
- **Considerations**: Requires a local Cardano node, Unix-compatible systems only

#### TCP Provider (N2NProvider)

```json
"ConnectionType": "TCP",
"TCP": {
  "Host": "192.168.1.100",
  "Port": 8090
}
```

- **Best for**: Network access to remote Cardano nodes
- **Advantages**: Works across network boundaries
- **Considerations**: Performance depends on network conditions (currently in development)

### 3. Network Magic Values

Set the `NetworkMagic` parameter according to your target Cardano network:

<br/>

| Network | Magic Value | Purpose |
|---------|-------------|---------|
| **Mainnet** | 764824073 | Production environment |
| **Preview Testnet** | 2 | Testing environment |
| **PreProd Testnet** | 1 | Pre-production testing |

## Implementing the Database Context

Entity Framework Core provides the data access layer for Argus. You'll need to create a custom DbContext class.

### 1. Create the DbContext Class

Create a new file called `MyDbContext.cs` with the following content:

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

### 2. Register Services in Dependency Injection

Update your `Program.cs` file to register Argus services:

```csharp
using Argus.Sync.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Register Argus services
builder.Services.AddCardanoIndexer<MyDbContext>(builder.Configuration);
builder.Services.AddReducers<MyDbContext, IReducerModel>(builder.Configuration);

var app = builder.Build();
app.Run();
```

## Adding Your First Reducer

Reducers are the core components that process blockchain data. Here's how to create a simple reducer.

### 1. Create a Block Indexer Reducer

Create a new file called `BlockReducer.cs`:

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

### 2. Create the BlockInfo Model

Create a new file called `BlockInfo.cs`:

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

### 3. Update Your DbContext

Update your `MyDbContext.cs` file to include the BlockInfo DbSet:

```csharp
public interface IMyDbContext
{
    DbSet<BlockInfo> Blocks { get; set; }
}

public class MyDbContext : CardanoDbContext, IMyDbContext
{
    public DbSet<BlockInfo> Blocks { get; set; }
    
    // ... rest of the class
}
```

### 4. Register the Reducer

Update your `Program.cs` file to register the new reducer:

```csharp
// Register reducers automatically from the assembly
builder.Services.AddReducers<MyDbContext, IReducerModel>(builder.Configuration);

// Alternatively, register specific reducers
builder.Services.AddReducers<MyDbContext, IReducerModel>([
    typeof(BlockReducer)
]);
```

## Running the Application

Now that everything is set up, you can start your Argus indexer.

### 1. Create and Apply Migrations

Generate and apply Entity Framework migrations:

```bash
# Create the initial migration
dotnet ef migrations add InitialMigration

# Apply the migration to the database
dotnet ef database update
```

### 2. Start the Application

Run your application to begin indexing the blockchain:

```bash
dotnet run
```

### 3. Verify the Installation

To confirm that Argus is running correctly:

1. Check your database to see if the `Blocks` and `ReducerStates` tables are created
2. Monitor your application logs for successful blockchain synchronization
3. Use a database tool like pgAdmin to view indexed data

:::tip Monitoring Progress
Argus includes a dashboard for tracking synchronization progress. When TuiMode is enabled in your configuration, you'll see a terminal-based dashboard showing synchronization status.
:::

### 4. Build APIs with Your Indexed Data

Once you have blockchain data indexed, you can easily build APIs to expose this data:

```csharp
// Add to your Program.cs
app.MapGet("/api/blocks/latest", async (IDbContextFactory<MyDbContext> dbContextFactory) =>
{
    using var db = dbContextFactory.CreateDbContext();
    return await db.Blocks
        .OrderByDescending(b => b.Number)
        .Take(10)
        .ToListAsync();
});

app.MapGet("/api/blocks/{hash}", async (string hash, IDbContextFactory<MyDbContext> dbContextFactory) =>
{
    using var db = dbContextFactory.CreateDbContext();
    var block = await db.Blocks.FindAsync(hash);
    return block is null ? Results.NotFound() : Results.Ok(block);
});

// If you track transactions
app.MapGet("/api/transactions/by-block/{blockHash}", async (string blockHash, IDbContextFactory<MyDbContext> dbContextFactory) =>
{
    using var db = dbContextFactory.CreateDbContext();
    return await db.Transactions
        .Where(tx => tx.BlockHash == blockHash)
        .ToListAsync();
});
```

With these endpoints, you've created a blockchain API that can:
- Return the latest 10 blocks
- Look up block details by hash
- List transactions in a specific block

## Advanced Configuration

### Scaling for Production

For production deployments, consider these optimization strategies:

1. **Database Indexing**: Create appropriate indexes for your queries
2. **Connection Pooling**: Adjust connection pool settings based on your workload
3. **Resource Allocation**: Allocate adequate CPU and memory resources
4. **Batch Processing**: Configure batch sizes for optimal throughput

### Performance Optimization Settings

Add these settings to your `appsettings.json` file for performance tuning:

```json
{
  "Sync": {
    "Dashboard": {
      "TuiMode": true,
      "RefreshInterval": 5000,
      "DisplayType": "sync"
    },
    "MaxConcurrency": 4,
    "MaxItemsPerBatch": 1000,
    "PollingIntervalMs": 1000
  }
}
```

| Setting | Description | Default | Recommended Range |
|---------|-------------|---------|-------------------|
| `MaxConcurrency` | Number of blocks processed concurrently | 1 | 1-8 depending on CPU cores |
| `MaxItemsPerBatch` | Maximum items in a processing batch | 100 | 100-1000 depending on memory |
| `PollingIntervalMs` | Milliseconds between node polls | 1000 | 500-5000 depending on node type |
| `EnableDashboard` | Enables the monitoring dashboard | true | true for development |

## Troubleshooting

### Common Issues and Solutions

| Issue | Possible Causes | Solutions |
|-------|-----------------|-----------|
| **Connection Errors** | Incorrect connection string, firewall blocking access | Verify connection details, check network settings |
| **Authentication Failures** | Wrong database credentials | Update connection string with correct username/password |
| **Slow Synchronization** | Inefficient reducers, network latency | Optimize reducer code, consider local node connection |
| **Out of Memory Errors** | Processing too many items at once | Reduce batch size, increase server memory |
| **Database Locking** | Concurrent write operations | Implement proper transaction management |

### Logging and Diagnostics

Enable enhanced logging to troubleshoot issues:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Argus.Sync": "Debug",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  }
}
```

---

Congratulations! You've successfully installed and configured Argus. You're now ready to build powerful blockchain data applications on Cardano.