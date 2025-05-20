---
title: Use Cases
sidebar_position: 3
hide_title: true
---

![Argus Use Cases Banner](/img/docs/argus/guides/argus-use-cases-banner.webp)

This guide explores practical applications of Argus and provides best practices for integrating it into your Cardano blockchain projects. You'll discover real-world use cases and implementation patterns that leverage Argus's powerful indexing capabilities.

---

## Example Use Cases

Argus's flexible architecture makes it suitable for a wide range of blockchain applications. Here are some concrete examples with implementation details.

### Balance By Address Reducer

Want to track the current active balance of addresses on the blockchain? Let's design a model to handle this:

```csharp
// Balance by address model
public record BalanceByAddress(
    string Address,      // The wallet address
    decimal LovelaceAmount,  // Amount in lovelace
    Dictionary<string, long> Tokens, // Native token balances
    ulong Slot     // Block slot of current utxo
) : IReducerModel;
```

#### How the Balance Reducer Works

The `BalanceByAddressReducer` system monitors blockchain transactions to maintain up-to-date records of address balances:

1. **Input/Output Processing**: The reducer analyzes transaction inputs and outputs to identify address balance changes.
2. **Token Accounting**: When native tokens are detected, the system updates the token dictionary with current quantities.
3. **UTxO Management**: The system tracks unspent transaction outputs to calculate accurate balances.
4. **Rollback Handling**: During chain rollbacks, the system can reconstruct previous balance states by reversing transactions.

When a transaction occurs on the blockchain, the balance by address reducer processes each transaction input and transaction output , adjusting the relevant address balances accordingly. It keeps track of both ADA (lovelace) and native tokens, providing a complete picture of an address's holdings at any point in time.

:::info Balance Tracker Applications
A balance tracker serves as the foundation for:

- Wallet dashboards showing real-time assets
- Portfolio tracking applications
- Transaction history and activity monitors
- Analytics for address behavior patterns
  :::

### DeFi Reducer

Want to build a system that tracks DEX activity? Your reducers will need to process liquidity pool changes and swap transactions. Here are the models to get started:

```csharp
// DEX pool model
public record DexPoolById(
    string PoolId,
    string TokenA,
    string TokenB,
    decimal TokenAAmount
) : IReducerModel;
```

#### How the DeFi Reducer Works

The `DexPoolByIdReducer` captures the dynamic activity of decentralized exchanges by monitoring specific transaction patterns:

- **Pool Tracking**: Monitors creation events and liquidity changes across different protocols.
- **Swap Analysis**: Records transaction details including amounts, direction, and price impact.
- **Rollback Handling**: Maintains historical pool states to ensure accuracy during chain rollbacks.

:::info DEX Reducer Capabilities
With this model structure, your application can:

- Track liquidity across multiple DEX protocols
- Calculate and compare swap prices in real-time
- Generate market depth charts for trading pairs
  :::

### NFT Asset Reducer

Looking to track individual NFTs and their lifecycle on the blockchain? Let's design models that focus on individual NFT assets and their activity:

```csharp
// Individual NFT asset model
public record NftAssetBySubject(
    string Subject,
    string PolicyId,
    string AssetName,
    string CurrentOwner,
    byte[] RawMetadata,
    ulong Slot,
    decimal CurrentPrice
) : IReducerModel;
```

#### How the NFT Asset Reducer Works

The `NftAssetBySubjectReducer` monitors the complete lifecycle of individual NFTs on the blockchain:

1. **Mint Tracking**: The system detects when new NFTs are created, capturing their original metadata and initial owner.
2. **Ownership Changes**: Every time an NFT changes hands, the tracker updates ownership records and transaction history.
3. **Metadata Extraction**: The tracker extracts and stores on-chain metadata associated with each NFT asset.

This approach centers on tracking the current state of each NFT asset, capturing details such as the current owner, price, and associated metadata. Every transaction involving the NFT triggers an update to the asset’s record, ensuring the model reflects the latest information. This comprehensive tracking allows for an up-to-date view of ownership, pricing, and metadata changes over time

:::info NFT Asset Tracking Applications
With this individual asset-focused approach, you can build features like:

- Ownership verification and history validation
- Individual asset valuation based on transaction history
- Metadata exploration and visualization
  :::
