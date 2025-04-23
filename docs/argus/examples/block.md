---
title: BlockTest Reducer
sidebar_label: BlockTest Reducer
sidebar_position: 2
---

This example demonstrates a minimal reducer that indexes only block headers (hash, number, slot) into a database.

## 1. Define the Model

```csharp
using Argus.Sync.Data.Models;

namespace Argus.Sync.Example.Models;

public record BlockTest(
    string BlockHash,
    ulong BlockNumber,
    ulong Slot,
    DateTime CreatedAt
) : IReducerModel;
```

## 2. Database Context

Extend `CardanoDbContext` to include only the `BlockTests` set:

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
            entity.HasKey(b => b.BlockHash);
        });
    }
}
```

## 3. Implement the Reducer

Create a class implementing `IReducer<BlockTest>`, handling only block-level events:

```csharp
using Argus.Sync.Example.Models;
using Argus.Sync.Extensions;
using Argus.Sync.Reducers;
using Chrysalis.Cbor.Extensions.Cardano.Core;
using Chrysalis.Cbor.Extensions.Cardano.Core.Header;
using Microsoft.EntityFrameworkCore;

namespace Argus.Sync.Example.Reducers;

public class BlockTestReducer(
    IDbContextFactory<TestDbContext> dbContextFactory
) : IReducer<BlockTest>
{
    public async Task RollBackwardAsync(ulong slot)
    {
        await using var db = dbContextFactory.CreateDbContext();
        db.BlockTests.RemoveRange(
            db.BlockTests
              .AsNoTracking()
              .Where(b => b.Slot >= slot)
        );
        await db.SaveChangesAsync();
    }

    public async Task RollForwardAsync(Block block)
    {
        string hash = block.Header().Hash();
        ulong number = block.Header().HeaderBody().BlockNumber();
        ulong slot = block.Header().HeaderBody().Slot();

        var entry = new BlockTest(hash, number, slot, DateTime.UtcNow);
        await using var db = dbContextFactory.CreateDbContext();
        db.BlockTests.Add(entry);
        await db.SaveChangesAsync();
    }
}
```

## 4. Register in `Program.cs`

Configure Argus to use your `TestDbContext` and reducer:

```csharp
// in Program.cs
builder.Services.AddCardanoIndexer<TestDbContext>(builder.Configuration);
builder.Services.AddReducers<TestDbContext, IReducerModel>(builder.Configuration);

var app = builder.Build();
app.Run();
```

## 5. Create migrations, build, and run

```bash
# Scaffold migrations and apply schema
dotnet ef migrations add InitialBlockTest
dotnet ef database update

# Build and start the app
dotnet build
dotnet run -c Release
```

With the application running, Argus will process new blocks and populate the `BlockTests` table with block hash, number, slot, and timestamp.
