---
id: reducer
slug: /features/reducer
title: Reducer
sidebar_label: Reducer
sidebar_position: 1
---

# Reducer

A **Reducer** is Argus’s extension point: implement your application logic here to process every block (rollforward) and revert state when needed (rollback).

## How It Works

1. **Rollforward**  
   Called for each new block that arrives. You receive a fully deserialized `Block` object: its header, transactions, witnesses, auxiliary data, and any invalid txs.
2. **Rollback**  
   Triggered when the node reports a chain reorganization. You get the slot to which you must revert your state.

---

## Rollforward

### Purpose

Index or transform data from each new block in real time:

- **Block metadata**: hash, number, slot
- **Transactions**: inputs, outputs, fees
- **Smart‑contract UTxOs**: mint events, datum, redeemers

### Signature

```csharp
Task RollForwardAsync(Block block);
```

### Example

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
        // e.g. record tx.Id, fee, and outputs
    }

    // 3) Persist summary
    await using var db = _factory.CreateDbContext();
    db.BlockTests.Add(new BlockTest(hash, height, slot, DateTime.UtcNow));
    await db.SaveChangesAsync();
}
```

**Tip:** keep logic focused—split concerns into helper methods or smaller reducers.

---

## Rollback

### Purpose

When Cardano reorganizes, blocks previously indexed may disappear. Rollback ensures your data reflects the new canonical chain.

### Signature

```csharp
Task RollBackwardAsync(ulong rollbackSlot);
```

### Simple Implementation

Remove any records from the rollback slot onward:

```csharp
public async Task RollBackwardAsync(ulong rollbackSlot)
{
    await using var db = _factory.CreateDbContext();
    var stale = db.BlockTests.Where(b => b.Slot >= rollbackSlot);
    db.BlockTests.RemoveRange(stale);
    await db.SaveChangesAsync();
}
```

### Advanced Rollback Mode

Enable one‑time or per‑reducer rollback in `appsettings.json` to test reprocessing without restarting:

```jsonc
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

With rollback mode active, Argus will revert to the specified slot, invoke `RollBackwardAsync`, then exit. Turn off `Enabled` to resume normal sync.

---

## Best Practices

- **Idempotence:** design reducers so repeated `RollForwardAsync` calls produce the same result when replayed.
- **Error Handling:** catch and log exceptions; avoid partial commits.
- **State Tracking:** if you manage intermediate state, record checkpoints in your model.
- **Separation of Concerns:** delegate parsing, validation, and persistence to dedicated services or helper classes.

Next up: **Configuration** — fine‑tune node settings, rollback behavior, and dashboard options.
