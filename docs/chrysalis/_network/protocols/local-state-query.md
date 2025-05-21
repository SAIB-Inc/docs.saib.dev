---
title: LocalStateQuery
sidebar_position: 4
---

# LocalStateQuery Mini-Protocol
LocalStateQuery lets a client inspect a node’s on-chain ledger state at a specific point without requiring full node logic. You can fetch the current era, protocol parameters, UTxO sets, and more.

**Spec Reference:** Section 3.13 of the Ouroboros network specification.

## Available Queries

### Fetch the current Tip
Returns the current chain tip

```csharp
NodeClient client = await NodeClient.ConnectAsync(_socketPath);
await client.StartAsync();
Tip tip = await client.LocalStateQuery.GetTipAsync();
```

### Get the Current Era
Returns the active era (Byron, Shelley, …, Conway).

```csharp
NodeClient client = await NodeClient.ConnectAsync(_socketPath);
await client.StartAsync();
var era = await client.LocalStateQuery.GetCurrentEraAsync();
```

### Fetch Protocol Parameters
Returns the current protocol parameters (fees, block sizes, etc.)

```csharp
NodeClient client = await NodeClient.ConnectAsync(_socketPath);
await client.StartAsync();
var era = await client.LocalStateQuery.GetCurrentProtocolParams();
```

### Fetch UTxOs by Address
Given a list of addresses, returns their UTxO entries.

```csharp
NodeClient client = await NodeClient.ConnectAsync(_socketPath);
await client.StartAsync();
Address address = new(bech32AddresssString)
var utxos = await client.LocalStateQuery.GetUtxosByAddress([address]);
```

### Fetch UTxOs by Transaction Inputs
 Given a list of transaction inputs, returns the matching UTxOs.

```csharp
NodeClient client = await NodeClient.ConnectAsync(_socketPath);
await client.StartAsync();
TransactionInput txIn = new(txHash, 0);
var utxos = await client.LocalStateQuery.GetUtxosByAddress([txIn]);
```
