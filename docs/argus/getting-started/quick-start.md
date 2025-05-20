---
title: Quick Start
sidebar_position: 2
description: Get up and running with Argus in minutes
hide_title: true
---

![Quick Start Banner](/img/docs/argus/getting-started/quick-start-banner.webp)

This quick start will help you set up a minimal Argus indexer in just a few minutes.

## 📋 Prerequisites

- **.NET 9.0 SDK** or later
- **PostgreSQL** database
- **Entity Framework Core**

## 🏗️ Step 1: Create Project & Install Packages

```bash
# Create a new project
dotnet new webapi -n ArgusQuickStart
cd ArgusQuickStart

# Install packages
dotnet add package Argus.Sync --version 0.3.1-alpha
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

## 📝 Step 2: Add Minimal Code

Create these three files:

**BlockInfo.cs** - *Your blockchain data model*
```csharp
using Argus.Sync.Data.Models;

public record BlockInfo(
    string Hash,      // 🔑 Block identifier
    ulong Number,     // 🔢 Block height
    ulong Slot,       // ⏱️ Slot number
    DateTime CreatedAt // 📅 Timestamp
) : IReducerModel;
```

**MyDbContext.cs** - *Database access layer*
```csharp
using Argus.Sync.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class MyDbContext(DbContextOptions options, IConfiguration configuration) 
    : CardanoDbContext(options, configuration)
{
    public DbSet<BlockInfo> Blocks => Set<BlockInfo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<BlockInfo>(e => e.HasKey(b => b.Hash));
    }
}
```

**BlockReducer.cs** - *Data transformation logic*
```csharp
using Argus.Sync.Reducers;
using Chrysalis.Cbor.Types.Cardano.Core;
using Microsoft.EntityFrameworkCore;

public class BlockReducer(IDbContextFactory<MyDbContext> dbContextFactory)
    : IReducer<BlockInfo>
{
    // ⬆️ Called when processing new blocks
    public async Task RollForwardAsync(Block block)
    {
        using var db = dbContextFactory.CreateDbContext();
        db.Blocks.Add(new BlockInfo(
            block.Header().Hash(),
            block.Header().HeaderBody().BlockNumber(),
            block.Header().HeaderBody().Slot(),
            DateTime.UtcNow
        ));
        await db.SaveChangesAsync();
    }

    // ⬇️ Called during chain reorganizations
    public async Task RollBackwardAsync(ulong slot)
    {
        using var db = dbContextFactory.CreateDbContext();
        db.Blocks.RemoveRange(db.Blocks.Where(b => b.Slot >= slot));
        await db.SaveChangesAsync();
    }
}
```

## ⚙️ Step 3: Configuration

Replace **appsettings.json** with:

```json
{
  "ConnectionStrings": {
    // 🗄️ Database settings
    "CardanoContext": "Host=localhost;Database=argus;Username=postgres;Password=password;Port=5432",
    "CardanoContextSchema": "cardanoindexer"
  },
  "CardanoNodeConnection": {
    // 🔗 Blockchain connection (using gRPC for simplicity)
    "ConnectionType": "gRPC",
    "gRPC": {
      "Endpoint": "https://cardano-preview.utxorpc-m1.demeter.run",
      "ApiKey": "your_api_key"
    },
    "NetworkMagic": 2  // 🧪 Preview testnet magic
  },
  "Sync": {
    // 📊 Dashboard settings
    "Dashboard": {
      "TuiMode": true,
      "RefreshInterval": 5000
    }
  }
}
```

Replace **Program.cs** with:

```csharp
using Argus.Sync.Extensions;

// 🏗️ Build the application
var builder = WebApplication.CreateBuilder(args);

// 🔌 Register Argus services
builder.Services.AddCardanoIndexer<MyDbContext>(builder.Configuration);
builder.Services.AddReducers<MyDbContext, IReducerModel>(builder.Configuration);

// 🚀 Launch!
var app = builder.Build();
app.Run();
```

## 🚀 Step 4: Run

```bash
# Create and apply migrations
dotnet ef migrations add Initial
dotnet ef database update

# Start the indexer
dotnet run
```

When successfully running, you'll see the Argus dashboard:

![Argus Running](/img/docs/argus/getting-started/argus_running.png)

## 🔮 What's Next?

- Learn about advanced [Configuration Options](./configuration)