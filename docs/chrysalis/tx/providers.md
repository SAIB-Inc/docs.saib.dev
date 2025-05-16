---
title: Provider
sidebar_position: 3
---


# Provider

In Chrysalis.Tx, constructing and submitting Cardano transactions—whether via the granular `TransactionBuilder` or high-level `TransactionTemplateBuilder`—depends on reliable access to on-chain state to gather utxos. **Providers** encapsulate these network interactions behind a common interface, decoupling transaction logic from transport details. By implementing `ITransactionProvider`, a backend can supply UTxOs for coin selection, deliver up-to-date protocol parameters for fee and script budgeting, and broadcast signed transactions to the chain.

This abstraction enables:

- **Interchangeable Backends:** Swap between APIs (e.g., Blockfrost) and direct node connections (via Chrysalis.Network/Ouroboros) without modifying transaction code.
- **Extensibility:** Add custom providers or by implementing the same interface.

---

## 1. Provider Interface

All providers implement `ITransactionProvider`, which exposes three core async methods:

```csharp
public interface ITransactionProvider
{
    Task<List<ResolvedInput>> GetUtxosAsync(string address);
    Task<ProtocolParams> GetProtocolParametersAsync();
    Task<string> SubmitTransactionAsync(byte[] transactionCbor);
}
```

- **GetUtxosAsync(address):** Retrieves UTxOs at the given address for input selection.
- **GetProtocolParametersAsync():** Fetches current fee, execution unit prices, and network constants.
- **SubmitTransactionAsync(cbor):** Submits a signed, serialized transaction to the network and returns its transaction hash.

You pass your chosen provider into both `TransactionBuilder.Create(...)` and `TransactionTemplateBuilder<T>.Create(provider)`.

---

## 2. Supported Providers

### 2.1 Blockfrost Provider

Uses the Blockfrost REST API to interact with Cardano testnet or mainnet:

```csharp
using Chrysalis.Tx.Providers;

var provider = new BlockfrostProvider("<apiKey>");
```

**Functionality**
- `GetUtxosAsync(address)` → calls `/addresses/{address}/utxos`
- `GetProtocolParametersAsync()` → calls `/epochs/latest/parameters`
- `SubmitTransactionAsync(cbor)` → calls `/tx/submit`

### 2.2 Ouroboros Provider

Leverages `Chrysalis.Network` to connect directly to a local Cardano node via IPC:

```csharp
using Chrysalis.Tx.Providers;

var provider = new OuroborosProvider("/ipc/node.socket");
```

**Functionality**
- `GetUtxosAsync(address)` → local state query
- `GetProtocolParametersAsync()` → on-chain consensus parameters
- `SubmitTransactionAsync(cbor)` → submits via node’s Tx submission protocol

---
