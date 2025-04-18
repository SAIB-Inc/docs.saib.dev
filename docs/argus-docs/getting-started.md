---
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 2
slug: /getting-started
---

Follow these steps to install and run a minimal Argus indexer example.

## 1. Install the NuGet package

```bash
# Core Argus library
dotnet add package Argus.Sync
```

## 2. Install EF Core tooling and provider

Add the EF Core design package and PostgreSQL provider, which are needed before defining the database context:

```bash
# EF Core migrations support
dotnet add package Microsoft.EntityFrameworkCore.Design
# PostgreSQL provider
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

## 3. Define your DbContext

Create an EF Core `TestDbContext` by extending `CardanoDbContext`. This context will back your `BlockTestReducer`:

```csharp
using Argus.Sync.Data;
using Argus.Sync.Example.Models;
using Microsoft.EntityFrameworkCore;

public class TestDbContext(
    DbContextOptions<TestDbContext> options,
    IConfiguration configuration
) : CardanoDbContext(options, configuration)
{
    public DbSet<BlockTest> BlockTests => Set<BlockTest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BlockTest>(entity =>
        {
            entity.HasKey(e => e.BlockHash);
        });
    }
}
```

## 4. Implement the sample reducer

Use the provided `BlockTestReducer` as a concrete example. It implements `IReducer<BlockTest>` and persists data using `TestDbContext`:

```csharp
public record BlockTest(string BlockHash, ulong BlockNumber, ulong Slot, DateTime CreatedAt) : IReducerModel;

using Argus.Sync.Example.Models;
using Argus.Sync.Extensions;
using Argus.Sync.Reducers;
using Chrysalis.Cbor.Extensions.Cardano.Core;
using Chrysalis.Cbor.Extensions.Cardano.Core.Header;
using Chrysalis.Cbor.Types.Cardano.Core;
using Chrysalis.Cbor.Types.Cardano.Core.Header;
using Microsoft.EntityFrameworkCore;

namespace Argus.Sync.Example.Reducers;

public class BlockTestReducer(
    IDbContextFactory<TestDbContext> dbContextFactory
) : IReducer<BlockTest>
{
    public async Task RollBackwardAsync(ulong slot)
    {
        using var db = dbContextFactory.CreateDbContext();
        db.BlockTests.RemoveRange(
            db.BlockTests.AsNoTracking().Where(b => b.Slot >= slot)
        );
        await db.SaveChangesAsync();
    }

    public async Task RollForwardAsync(Block block)
    {
        string blockHash = block.Header().Hash();
        ulong blockNumber = block.Header().HeaderBody().BlockNumber();
        ulong slot = block.Header().HeaderBody().Slot();

        using var db = dbContextFactory.CreateDbContext();
        db.BlockTests.Add(
            new BlockTest(blockHash, blockNumber, slot, DateTime.UtcNow)
        );
        await db.SaveChangesAsync();
    }
}
```

## 5. Register Argus and reducers

In your ASP.NET Core `Program.cs`, register the Cardano indexer and reducers with `TestDbContext`:

```csharp
using Argus.Sync.Data.Models;
using Argus.Sync.Example.Api;
using Argus.Sync.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add Cardano indexer and default EF Core/PostgreSQL persistence
builder.Services.AddCardanoIndexer<TestDbContext>(builder.Configuration);
builder.Services.AddReducers<TestDbContext, IReducerModel>(builder.Configuration);

// Optional: add other services, e.g., OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();
app.Run();
```

## 6. Create migrations and update the database

Generate and apply your database schema:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 7. Run the application

Start your ASP.NET Core app in Release configuration:

```bash
dotnet run -c Release
```

Once your application is running, Argus will process new blocks and invoke your `BlockTestReducer` to persist data in PostgreSQL.

## Configuration Sample

Below is a minimal `appsettings.json` example. We will explain each section in depth later:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=postgres;Username=postgres;Password=test1234;Port=5432;",
    "CardanoContextSchema": "public"
  },
  "CardanoNodeConnection": {
    "ConnectionType": "UnixSocket",
    "UnixSocket": {
      "Path": "/ipc/node.socket"
    },
    "gRPC": {
      "Endpoint": "",
      "ApiKey": ""
    },
    "NetworkMagic": 2,
    "MaxRollbackSlots": 1000,
    "RollbackBuffer": 10,
    "Slot": 57371845,
    "Hash": "20a81db38339bf6ee9b1d7e22b22c0ac4d887d332bbf4f3005db4848cd647743"
  },
  "Sync": {
    "Rollback": {
      "Enabled": false,
      "RollbackHash": "20a81db38339bf6ee9b1d7e22b22c0ac4d887d332bbf4f3005db4848cd647743",
      "RollbackSlot": 57371845,
      "Reducers": {
        "BlockTestReducer": {
          "Enabled": false,
          "RollbackHash": "20a81db38339bf6ee9b1d7e22b22c0ac4d887d332bbf4f3005db4848cd647743",
          "RollbackSlot": 57371845
        }
      }
    },
    "Dashboard": {
      "TuiMode": true,
      "RefreshInterval": 5000,
      "DisplayType": "sync"
    },
    "State": {
      "ReducerStateSyncInterval": 5000
    }
  }
}
```
