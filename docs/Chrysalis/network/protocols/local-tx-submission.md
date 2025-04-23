---
title: LocalTxSubmission
sidebar_position: 3
---

# LocalTxSubmission Mini-Protocol

The LocalTxSubmission protocol allows you to submit a fully constructed transaction to a Cardano node. It ensures reliable delivery with acknowledgment of acceptance or rejection.

**Spec Reference:** Section 3.12 of the Ouroboros network specification (local transaction submission).

## Protocol Flow
1. **MsgSubmitTx**: Client sends a `SubmitTx` message containing the transaction bytes encoded in CBOR.
2. **Response**: Node replies with one of:
   - `MsgAcceptTx(txId)`: The transaction was accepted into the mempool.
   - `MsgRejectTx(txId, reason)`: The transaction was rejected, with a refusal reason.

---

## Example
```csharp
// 1. Connect to the node and start protocol handlers
NodeClient client = await NodeClient.ConnectAsync(_configuration.SocketPath);
await client.StartAsync();

// 2. Deserialize the CBOR-encoded transaction into a Transaction object
var transaction = CborSerializer.Deserialize<Transaction>(txCborBytes);

// 3. Extract the TransactionBody based on its era (Shelley, Allegra, Mary)
var transactionBody = transaction switch
{
    ShelleyTransaction tx => tx.TransactionBody,
    AllegraTransaction tx => tx.TransactionBody,
    PostMaryTransaction tx => tx.TransactionBody,
    _ => throw new InvalidOperationException("Unsupported transaction type")
};

// 4. Prepare the transaction for local submission (protocol ID = 6)
var eraTx = new EraTx(
    6, // Protocol ID for LocalTxSubmission
    new CborEncodedValue(Convert.FromHexString(txCborHex))
);

// 5. Submit the transaction and await the node's response
var result = await client.LocalTxSubmit
    .SubmitTxAsync(
        new SubmitTx(new Value0(0), eraTx),
        CancellationToken.None
    );

// 6. Handle the response: compute hash if accepted, or throw on rejection
var txHash = result switch
{
    AcceptTx _ => Convert.ToHexString(HashUtil.Blake2b256(transactionBody)).ToLowerInvariant(),
    RejectTx rej => throw new InvalidOperationException($"Tx rejected: {rej.Reason}"),
    _ => throw new InvalidOperationException("Unexpected response from node")
};

Console.WriteLine($"Transaction Hash: {txHash}");
```

This pattern allows your application to submit transactions and respond to the node’s mempool status programmatically, integrating seamlessly with on-chain workflows.

