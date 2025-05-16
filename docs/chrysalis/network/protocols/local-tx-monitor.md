---
title: LocalTxMonitor
sidebar_position: 5
---

# LocalTxMonitor Mini-Protocol 

LocalTxMonitor allows a client to observe the node’s mempool and transaction status over time. You can acquire a snapshot of pending transactions, query individual transaction presence.

**Spec Reference:**  Section 3.14 of the Ouroboros network specification (local transaction monitoring).

## Protocol Operations

1. **Acquire**  
   - **Message:** `MsgAcquire(point)` (optional `point`, `null` = latest tip)  
   - **Response:** `MsgAcquired(point, tip)` acknowledging access to the UTxO snapshot at `point`.

2. **HasTx**  
   - **Message:** `MsgHasTx(txId)`  
   - **Response:** `MsgHasTxReply(txId, Bool)` indicating whether `txId` is currently in the mempool.

3. **NextTx**  
   - **Message:** `MsgNextTx` request for the next transaction update.  
   - **Response:** `MsgRollForward(tx)` with the next pending transaction, or `MsgAwaitReply` if no new transactions are available yet.  
   - Repeat to continuously stream incoming mempool entries.

4. **Release**  
   - **Message:** `MsgRelease` indicating end of monitoring.  
   - **Response:** `MsgReleased` confirming the monitor has been closed.

## Example Usage
```csharp
// 1. Connect and start the client
var client = await NodeClient.ConnectAsync(_socketPath);
await client.StartAsync();
// 2. Acquire mempool snapshot at latest tip
await client.LocalTxMonitor.AcquireAsync();

// 3. Check if a specific Tx is present
bool exists = await client.LocalTxMonitor.HasTxAsync(myTxId);

// 4. Stream new transactions as they arrive
while (true)
{
    var pending = await client.LocalTxMonitor.NextTxAsync(cancellationToken);  // blocks until next tx
    Console.WriteLine($"New pending tx: {pending.TxId}");
}

// 5. Release the monitor when done
await client.LocalTxMonitor.ReleaseAsync(cancellationToken);
```

Use `LocalTxMonitor` to integrate mempool awareness into wallets, analytics tools, or transaction relayers, responding to live transaction flows in your application.

