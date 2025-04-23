---
id: database
slug: /database
title: Database
sidebar_label: Database
sidebar_position: 4
---

# Database

Argus relies on a persistent store to checkpoint progress and to retain any data produced by your reducers. By default, Argus uses Entity Framework Core with PostgreSQL, but you can plug in other databases by extending `CardanoDbContext`.

---

## Checkpointing: ReducerStates

Argus tracks each reducer’s sync position in a table named `ReducerStates`. After running `dotnet ef migrations add InitialCreate`, you’ll see this schema:

```sql
CREATE TABLE "ReducerStates" (
  "Name"        TEXT    PRIMARY KEY,
  "StartHash"   TEXT    NOT NULL,
  "StartSlot"   BIGINT  NOT NULL,
  "LatestHash"  TEXT    NOT NULL,
  "LatestSlot"  BIGINT  NOT NULL,
  "UpdatedAt"   TIMESTAMP WITH TIME ZONE NOT NULL
);
```

- **Name**: reducer identifier (e.g. `BlockTestReducer`).
- **StartHash/StartSlot**: initial intersection.
- **LatestHash/LatestSlot**: most recent checkpoint.
- **UpdatedAt**: timestamp of last update.

Argus writes to `ReducerStates` at an interval you configure under `Sync:State:ReducerStateSyncInterval` (in milliseconds). For example:

```jsonc
"Sync": {
  "State": {
    "ReducerStateSyncInterval": 5000
  }
}
```

This ensures that, on restart, Argus resumes from the last saved slot instead of replaying all historical blocks.

---

## Extending the Schema

Add your own tables by subclassing `CardanoDbContext` in your application:

```csharp
using Argus.Sync.Data;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : CardanoDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> opts, IConfiguration cfg)
      : base(opts, cfg) { }

    public DbSet<SundaeSwapLiquidityPool> SundaeSwapLiquidityPools => Set<SundaeSwapLiquidityPool>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Composite key example
        modelBuilder.Entity<SundaeSwapLiquidityPool>()
            .HasKey(e => new { e.Identifier, e.Outref });
    }
}
```

Define your model:

```csharp
public record SundaeSwapLiquidityPool(
    Guid Identifier,
    string Outref,
    ulong Slot,
    decimal AdaAmount,
    decimal TokenAmount
);
```

After adding or updating entities, create and apply a migration:

```bash
dotnet ef migrations add AddSundaeSwapPools
dotnet ef database update
```

> **Warning**: Incompatible schema changes (e.g. removing columns) may require a full resync of your reducers.

---

## Best Practices

- **Transactional Writes**: Batch multiple inserts/updates in a single `SaveChangesAsync()` to reduce round-trips.
- **Index Key Columns**: Add indexes on frequently queried properties (e.g. `Slot`, foreign keys).
- **Soft Deletes**: If you need audit trails, consider marking records as deleted instead of hard-deleting on rollback.
- **Custom Providers**: To use another database (e.g. SQL Server, MySQL), install the appropriate EF Core provider and register it in `Program.cs`:

```csharp
builder.Services.AddDbContextFactory<AppDbContext>(opts =>
    opts.UseSqlServer(builder.Configuration.GetConnectionString("MyDb"))
);
```

Argus’s design keeps your data layer under your control—store what you need, how you need it.
