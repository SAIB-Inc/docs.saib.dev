---
title: Rollback
sidebar_label: Rollback
sidebar_position: 2
---

Rollback is invoked when the blockchain reorganizes (forks) and previously processed blocks become invalid. This callback function lets you revert state changes made by `RollForwardAsync` for a specified range of slots.

## What Is Rollback?

When Cardano’s chain forks, only one branch remains canonical. If Argus detects a reorganization, it calls `RollBackwardAsync` (or `Rollback`) with the slot number to revert to. For example, if the current tip is at slot 1000 and a rollback to slot 500 is required, Argus will invoke the callback with slot `500`, indicating that all data from slot 500 up to 1000 should be reverted.

## Why Rollback Happens

- **Network forks**: multiple nodes may propose different blocks at the same height. A single longest chain wins.
- **Chain reorganizations**: when a longer chain overtakes the one Argus was syncing, previous blocks must be rolled back.

## Simple Rollback Logic

A basic rollback implementation removes all persisted data for slots greater than or equal to the rollback slot:

```csharp
public async Task RollBackwardAsync(ulong rollbackSlot)
{
    using var db = dbContextFactory.CreateDbContext();
    // Delete all BlockTest entries at or after the rollback slot
    var toRemove = db.BlockTests
                     .Where(b => b.Slot >= rollbackSlot);
    db.BlockTests.RemoveRange(toRemove);
    await db.SaveChangesAsync();
}
```

## Advanced Rollback Mode

Argus supports an explicit **rollback mode** for controlled rollbacks (e.g., debugging, reprocessing data). Enable it in `appsettings.json` under `Sync.Rollback`:

```json
"Sync": {
  "Rollback": {
    "Enabled": true,
    "RollbackHash": "20a81db38339bf6ee9b1d7e22b22c0ac4d887d332bbf4f3005db4848cd647743",
    "RollbackSlot": 57371845,
    "Reducers": {
      "BlockTestReducer": {
        "Enabled": true,
        "RollbackHash": "...",
        "RollbackSlot": 57371845
      }
    }
  }
}
```

- **Enabled**: set to `true` to enter rollback mode.
- **RollbackHash** and **RollbackSlot**: default point for all reducers.
- **Reducers**: override per reducer; set `Enabled` to `false` to skip rollback for specific reducers.

> **Note**: Rollback mode only reverts data and does not automatically resume forward syncing. Disable rollback mode after reversion to continue processing new blocks.
