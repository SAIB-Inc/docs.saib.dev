---
title: Rollforward
sidebar_label: Rollforward
sidebar_position: 1
---

Rollforward is the main feature of Argus. It allows you to inspect a block and process it depending on your use case. This callback function receives a deserialized `Block`, giving access to its:

- Header
- Transaction bodies
- Witness sets
- Auxiliary data
- Invalid transactions

The logic inside `RollForwardAsync` depends on your application's requirements. We recommend breaking down reducers by concern:

- A reducer that indexes only block hash, number, and slot
- A reducer for transaction data
- A reducer for smart-contract UTxO data

With Argus, each reducer focuses on a specific slice of chain data, making your code modular and maintainable.

## Starting point

Argus invokes `RollForwardAsync` beginning at the slot and block hash defined under `CardanoNodeConnection` in `appsettings.json`. For example:

```json
"CardanoNodeConnection": {
  // ...
  "Slot": 148027022,
  "Hash": "9b06accfd37ecbeecd5a1c7bc12c70381cd932e5ae07883f19368d634d584a53"
}
```

## Example `RollForwardAsync` implementation

```csharp
public async Task RollForwardAsync(Block block)
{
    // Extract block header info
    var header = block.Header();
    string blockHash = header.Hash();
    ulong blockNumber = header.HeaderBody().BlockNumber();
    ulong slot = header.HeaderBody().Slot();

    // Inspect transactions
    foreach (var tx in block.Body().TransactionBodies())
    {
        // e.g. log or index transaction details
    }

    // Persist a sample record
    using var db = dbContextFactory.CreateDbContext();
    db.BlockTests.Add(
        new BlockTest(blockHash, blockNumber, slot, DateTime.UtcNow)
    );
    await db.SaveChangesAsync();
}
```
