---
title: Database
sidebar_label: Database
sidebar_position: 3
---

Persisting data is essential when indexing a blockchain. It ensures that after a restart or crash, your application can resume from its last known state and avoid reprocessing all blocks from the configured starting point. Depending on your starting point, syncing to the current tip may take time.

Argus comes with built-in persistence using Entity Framework Core and PostgreSQL. Support for additional databases will be added in the future.

## ReducerStates

When you apply migrations, you’ll notice a `ReducerStates` table in your database schema. This table tracks the latest slot and block hash checkpoint for each reducer, enabling Argus to resume processing from the correct point after a restart.

Each reducer writes its own entry in `ReducerStates`, since different reducers may process at different speeds. The frequency of update to reducer states can be configured under `ReducerStateSyncInterval` which is the interval in milliseconds for each state update.

```json
"State": {
    "ReducerStateSyncInterval": 5000
}
```

## Custom Tables

You can add your own tables by extending `CardanoDbContext`. For example:

```csharp
using Argus.Sync.Data;
using Argus.Sync.Example.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext(
    DbContextOptions<AppDbContext> options,
    IConfiguration configuration
) : CardanoDbContext(options, configuration)
{
    public DbSet<SundaeSwapLiquidityPool> SundaeSwapLiquidityPools => Set<SundaeSwapLiquidityPool>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SundaeSwapLiquidityPool>(entity =>
        {
            entity.HasKey(e => new { e.Identifier, e.Outref });
        });
    }
}
```

After modifying your model, generate and apply a new migration:

```bash
dotnet ef migrations add <MigrationName>
dotnet ef database update
```

> **Caution**: Altering tables heavily may require a full resync if your schema changes are not backward-compatible.
