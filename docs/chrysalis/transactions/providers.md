---
title: Provider
sidebar_position: 3
---


# Provider

In Chrysalis.Tx, constructing and submitting Cardano transactions—whether via the granular `TransactionBuilder` or high-level `TransactionTemplateBuilder`—depends on reliable access to on-chain state to gather utxos. **Providers** encapsulate these network interactions behind a common interface, decoupling transaction logic from transport details. By implementing `ICardanoDataProvider`, a backend can supply UTxOs for coin selection, deliver up-to-date protocol parameters for fee and script budgeting, and broadcast signed transactions to the chain.

This abstraction enables:

- **Interchangeable Backends:** Swap between APIs (e.g., Blockfrost) and direct node connections (via Chrysalis.Network/Ouroboros) without modifying transaction code.
- **Extensibility:** Add custom providers or by implementing the same interface.

---

## 1. Provider Interface

All providers implement `ICardanoDataProvider`, which exposes three core async methods:

```csharp
public interface ICardanoDataProvider
{
    NetworkType NetworkType { get; }
    Task<List<ResolvedInput>> GetUtxosAsync(List<string> addresses);
    Task<ProtocolParams> GetParametersAsync();
    Task<string> SubmitTransactionAsync(ITransaction tx);
}
```

- **GetUtxosAsync(addresses):** Retrieves UTxOs at the given addresses for input selection.
- **GetParametersAsync():** Fetches current fee, execution unit prices, and network constants.
- **SubmitTransactionAsync(tx):** Submits a signed transaction and returns its hash.

You pass your chosen provider into both `TransactionBuilder.Create(...)` and `TransactionTemplateBuilder<T>.Create(provider)`.

---

## 2. Supported Providers

### 2.1 Blockfrost Provider

Uses the Blockfrost REST API to interact with Cardano testnet or mainnet:

```csharp
using Chrysalis.Tx.Providers;

var provider = new Blockfrost("<apiKey>");
```

**Functionality**
- `GetUtxosAsync(address)` → calls `/addresses/{address}/utxos`
- `GetProtocolParametersAsync()` → calls `/epochs/latest/parameters`
- `SubmitTransactionAsync(cbor)` → calls `/tx/submit`

### 2.2 Ouroboros Provider

Leverages `Chrysalis.Network` to connect directly to a local Cardano node via IPC:

```csharp
using Chrysalis.Tx.Providers;

var provider = new Ouroboros("/ipc/node.socket");
```

**Functionality**
- `GetUtxosAsync(address)` → local state query
- `GetProtocolParametersAsync()` → on-chain consensus parameters
- `SubmitTransactionAsync(tx)` → submits via node’s Tx submission protocol

### 2.3 Kupmios Provider

Combines [Kupo](https://cardanosolutions.github.io/kupo/) (UTxO indexer) and [Ogmios](https://ogmios.dev/) (node gateway) for fast queries:

```csharp
using Chrysalis.Tx.Providers;

var provider = new Kupmios("http://localhost:1442", "http://localhost:1337");
```

**Functionality**
- `GetUtxosAsync(addresses)` → Kupo HTTP API for indexed UTxO queries
- `GetParametersAsync()` → Ogmios WebSocket query
- `SubmitTransactionAsync(tx)` → Ogmios WebSocket submission

---
