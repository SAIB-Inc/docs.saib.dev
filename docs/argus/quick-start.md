---
id: quick-start
slug: /quick-start
title: Quick Start
sidebar_label: Quick Start
sidebar_position: 2
---

Get up and running with Argus in a few minutes:

## Prerequisites

- [.NET SDK 8+](https://dotnet.microsoft.com/download)
- A running PostgreSQL instance
- Connection details (host, port, credentials)

## 1. Add Argus to your project

```bash
# Core indexing engine
dotnet add package Argus.Sync
```

## 2. Install EF Core and PostgreSQL support

```bash
# EF Core tools for migrations
dotnet add package Microsoft.EntityFrameworkCore.Design
# PostgreSQL provider
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

## 3. Define your database context

Create a `TestDbContext` that inherits from `CardanoDbContext`:

```csharp
using Argus.Sync.Data;
using Microsoft.EntityFrameworkCore;

public class TestDbContext : CardanoDbContext
{
    public TestDbContext(DbContextOptions<TestDbContext> options, IConfiguration config)
      : base(options, config)
    { }

    public DbSet<BlockTest> BlockTests => Set<BlockTest>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<BlockTest>()
               .HasKey(x => x.BlockHash);
    }
}
```

Define the `BlockTest` model in `Argus.Sync.Example.Models`:

```csharp
public record BlockTest(
    string BlockHash,
    ulong BlockNumber,
    ulong Slot,
    DateTime CreatedAt
) : IReducerModel;
```

## 4. Implement a simple reducer

Create `BlockTestReducer` to persist each block:

```csharp
using Argus.Sync.Reducers;

public class BlockTestReducer : IReducer<BlockTest>
{
    private readonly IDbContextFactory<TestDbContext> _factory;
    public BlockTestReducer(IDbContextFactory<TestDbContext> factory) => _factory = factory;

    public async Task RollForwardAsync(Block block)
    {
        var header = block.Header();
        var entity = new BlockTest(
            header.Hash(),
            header.HeaderBody().BlockNumber(),
            header.HeaderBody().Slot(),
            DateTime.UtcNow
        );

        await using var db = _factory.CreateDbContext();
        db.BlockTests.Add(entity);
        await db.SaveChangesAsync();
    }

    public async Task RollBackwardAsync(ulong slot)
    {
        await using var db = _factory.CreateDbContext();
        var toRemove = db.BlockTests
                         .Where(b => b.Slot >= slot);
        db.BlockTests.RemoveRange(toRemove);
        await db.SaveChangesAsync();
    }
}
```

## 5. Register Argus and your reducer

In `Program.cs`, wire up the indexer and EF Core context:

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1) Add database context and migrations
builder.Services.AddDbContextFactory<TestDbContext>(opts =>
    opts.UseNpgsql(builder.Configuration.GetConnectionString("CardanoContext"))
);

// 2) Add Argus indexer and all IReducer<> implementations
builder.Services.AddCardanoIndexer<TestDbContext>(builder.Configuration);
builder.Services.AddReducers<TestDbContext, IReducerModel>(builder.Configuration);

var app = builder.Build();
app.Run();
```

## 6. Configure connection settings

Place your node and database settings in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=cardano;Username=postgres;Password=secret"
  },
  "CardanoNodeConnection": {
    "ConnectionType": "UnixSocket",
    "UnixSocket": { "Path": "/ipc/node.socket" },
    "NetworkMagic": 2,
    "Slot": 57371845,
    "Hash": "20a81d...47743"
  }
}
```

## 7. Run migrations

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 8. Start the indexer

```bash
dotnet run -c Release
```

Your `BlockTestReducer` will now receive every new block and store it in PostgreSQL.
