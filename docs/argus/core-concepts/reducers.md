---
title: Reducers
sidebar_position: 3
hide_title: true
---

![Reducers](/img/docs/argus/core-concepts/reducers.webp)

**Reducers** are at the heart of Argus, providing the foundation for processing blockchain data. They implement your application logic to handle each new block (rollforward) and revert state when necessary (rollback).

Reducers transform raw blockchain data into application-specific formats, letting you index and query exactly what your application needs. They process blocks as they arrive in real-time and handle chain reorganizations automatically.

---

## How Reducers Work

Reducers implement two primary operations to process blockchain data:

### 1. RollForward - Processing New Blocks

Called for each new block on the chain. Argus automatically deserializes the block and passes it to your reducer.

**Method Signature:**

```csharp
Task RollForwardAsync(Block block);
```

**Example Implementation:**

```csharp
public async Task RollForwardAsync(Block block)
{
    // 1) Extract header info
    var header = block.Header();
    string hash   = header.Hash();
    ulong height  = header.HeaderBody().BlockNumber();
    ulong slot    = header.HeaderBody().Slot();

    // 2) Process transactions
    foreach (var tx in block.Body().TransactionBodies())
    {
        // Extract and process transaction data
        // e.g., record tx.Id, fee, and outputs
    }

    // 3) Persist data to your database
    await using var db = _factory.CreateDbContextAsync();
    db.BlockTests.Add(new BlockTest(hash, height, slot, DateTime.UtcNow));
    await db.SaveChangesAsync();
}
```

<details>
<summary>Best Practices for RollForward</summary>

When implementing your RollForward logic:

- Keep logic focused on a single concern
- Split complex processing into helper methods
- Create multiple specialized reducers instead of one large reducer
- Use asynchronous database operations for better performance
- Batch database operations when processing many records
- Consider using transactions for related database operations
- Include comments explaining non-obvious business logic

</details>

### 2. RollBack - Handling Chain Reorganizations

Called when the node reports a chain reorganization. Your reducer must revert to the specified slot by removing or updating any data processed after that point.

**Method Signature:**

```csharp
Task RollBackwardAsync(ulong rollbackSlot);
```

**Example Implementation:**

```csharp
public async Task RollBackwardAsync(ulong rollbackSlot)
{
    await using var db = _factory.CreateDbContextAsync();

    // Remove all records processed after the rollback slot
    var staleRecords = db.BlockTests.Where(b => b.Slot >= rollbackSlot);
    db.BlockTests.RemoveRange(staleRecords);

    await db.SaveChangesAsync();
}
```

:::warning
Chain reorganizations are normal in blockchain systems. Your reducers must handle rollbacks correctly to maintain data integrity. Always test your rollback logic thoroughly.
:::

---

## Performance Best Practices

The Argus example reducers demonstrate two key performance patterns:

### 1. Use AsNoTracking for Rollback Queries

```csharp
public async Task RollBackwardAsync(ulong slot)
{
    using TestDbContext dbContext = dbContextFactory.CreateDbContext();
    dbContext.BlockTests.RemoveRange(
        dbContext
            .BlockTests
            .AsNoTracking()  // Improves query performance
            .Where(b => b.Slot >= slot)
    );
    await dbContext.SaveChangesAsync();
}
```

The `AsNoTracking()` method tells Entity Framework Core not to track the queried entities, which improves performance when you're only reading data to determine what to delete.

### 2. Batch Database Operations

```csharp
public async Task RollForwardAsync(Block block)
{
    using TestDbContext dbContext = dbContextFactory.CreateDbContext();
    
    ulong index = 0;
    foreach (var tx in block.TransactionBodies())
    {
        string txHash = tx.Hash();
        dbContext.TransactionTests.Add(new TransactionTest(...));
    }
    
    await dbContext.SaveChangesAsync();  // Single save for all transactions
}
```

Process all transactions in a block and save them with a single `SaveChangesAsync()` call. This reduces database round trips and improves throughput.

---

## Advanced Rollback Mode

Argus provides a configurable rollback mode for testing, debugging, or recovering from corrupted states. Configure it in your `appsettings.json`:

```json
"Sync": {
  "Rollback": {
    "Enabled": true,
    "RollbackSlot": 57371845,
    "Reducers": {
      "MyReducer": { "Enabled": true, "RollbackSlot": 57371845 }
    }
  }
}
```

### How It Works

When configured in rollback mode, Argus will:

1. Start the application normally
2. Identify the configured reducers to roll back
3. Call `RollBackwardAsync` on each selected reducer with the specified slot
4. Either exit (if running in one-shot mode) or continue normal synchronization

### Common Use Cases

This feature is particularly useful for:

- **Data Recovery**: Correct corrupted reducer state after an error
- **Testing**: Verify your rollback logic works correctly
- **Selective Reset**: Roll back specific reducers without affecting others
- **Historical Reprocessing**: Reset to a specific point to reprocess with updated logic

---

## Reducer Lifecycle

Argus manages reducers through a well-defined lifecycle:

### 1. Registration and Initialization

Reducers are registered with the dependency injection container and instantiated when Argus starts. You typically register reducers in your `Program.cs` file:

```csharp
// Register your reducers
builder.Services.AddReducers<MyCardanoDbContext>(
    typeof(MyCustomReducer),
    typeof(BlockBySlotReducer<>),
    typeof(TxBySlotReducer<>)
);
```

### 2. Block Processing

As the chain advances:

- Argus fetches blocks from the Cardano node
- For each block, Argus calls `RollForwardAsync` on all registered reducers
- Your reducers process and store the data according to your application's needs

### 3. Chain Reorganization Handling

When the Cardano node reports a chain reorganization:

- Argus determines the rollback point (slot)
- Calls `RollBackwardAsync` on all registered reducers with this slot
- Your reducers revert any data processed beyond this point
- Regular block processing resumes from the rollback point

### 4. Graceful Shutdown

When Argus stops:

- Pending operations are completed
- Database connections are closed properly
- Resources are released

This lifecycle is fully managed by the Argus framework, ensuring your reducers receive events in the correct order and at the appropriate times.

---

## Summary

Reducers are the core mechanism for processing blockchain data in Argus. By implementing the `RollForwardAsync` and `RollBackwardAsync` methods, you define how your application indexes, transforms, and queries Cardano data.

Whether you're building a block explorer, tracking specific addresses, or implementing complex analytics, reducers give you a flexible framework to transform raw blockchain data into application-specific models optimized for your use case.

For even faster development, consider using Argus's [built-in reducers](../guides/builtin-reducers.md) that handle common blockchain data patterns like blocks, transactions, and balances.