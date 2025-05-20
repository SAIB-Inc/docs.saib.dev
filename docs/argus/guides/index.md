---
title: Guides
sidebar_position: 1
---

# 🚀 Guides

This guide will walk you through the process of setting up and using Argus, from installation to running your first blockchain indexer application.

## 📋 Prerequisites

Before getting started, ensure you have the following:
```
- .NET 8.0 SDK or later installed
- PostgreSQL database installed and running
- Access to a Cardano node (local or remote)
```

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

### 5️⃣ Configure Application Settings

Create an `appsettings.json` file with necessary configuration:

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

### 7️⃣ Create and Apply Migrations

Generate and apply Entity Framework migrations:

```bash
# Create the initial migration
dotnet ef migrations add InitialMigration

# Apply the migration to the database
dotnet ef database update
```

### 8️⃣ Run Your Application

Start your application to begin synchronizing with the blockchain:

```bash
dotnet run
```

## 🧠 Understanding the Process

When your application runs, Argus will:

- Connect to the Cardano node using the configuration provided
- Start synchronizing blocks from the blockchain
- Process each block through your reducers
- Store the extracted data in your database
- Handle any chain reorganizations that occur

## 👣 Next Steps

Now that you have a basic Argus application running, you can:

- Implement additional reducers for different data types
- Create API endpoints to query your indexed data
- Build user interfaces to visualize blockchain data
- Explore advanced features like custom chain providers and specialized reducers

Check out the other guides in this section to learn more about these topics.