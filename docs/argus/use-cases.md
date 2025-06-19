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

The `BalanceByAddressReducer` follows a precise sequence of operations to track address balances. Here's the complete flow:

**1. Blockchain Data Processing**

When a new block arrives, the reducer immediately begins processing it:
- The block is read and all transactions are extracted
- Each transaction is analyzed for inputs (being consumed) and outputs (being created)

**2. Address and Amount Extraction**

For each transaction output being created:
- The reducer extracts the wallet address from the output
  ```
  Example address: addr1q9ld26v2lv8wvrxxmvg90pn8n8n5k6tdrf0qe9jmrq2gy2zd0rsz7qq3npl35ju8s9p7xqak2xtpg4y7kj0nzqu05s34vzl3
  ```
- The lovelace amount is identified from the output value
  ```
  Example amount: 10,000,000 lovelace (10 ADA)
  ```
- Any native tokens present in the output are also extracted

**3. Database Management**

The reducer maintains a single entry per address in the database:
- When an input is consumed, the system subtracts the spent amount from the existing address entry
- When a new output is created, the system checks if an entry for that address already exists:
  - If the address already exists in the database, the system updates the entry by adding the new output value
  - If no entry exists, a new entry is created:
  ```
  Entry = {
    Address: "addr1q9...",
    LovelaceAmount: 10000000,
    Tokens: {policyID.assetName: quantity, ...},
    Slot: currentBlockSlot
  }
  ```
  
This consolidated approach significantly reduces database size and improves query performance.

**4. Balance Calculation**

When an application requests the balance for an address:
- The system performs a simple, direct query for the address
- Since each address has only a single consolidated entry, no summation is needed

For example, querying the balance for address "addr1q9..." is as simple as:
```
SELECT LovelaceAmount, Tokens 
FROM BalanceByAddress 
WHERE Address = "addr1q9..."
```

The result immediately returns a complete balance record:

```
// Balance record for the address
{
  "Address": "addr1q9...",
  "LovelaceAmount": 15500000,  // 15.5 ADA
  "Tokens": {
    "SNEK": 1000,
    "HOSKY": 5000
  },
  "Slot": 12345678
}
```

This consolidated approach provides three key benefits:
1. Faster queries with no need to aggregate multiple entries
2. Lower database storage requirements
3. Simpler application code with direct access to total balances

In summary, by maintaining a single database entry per address, we can instantly provide the current balance without any additional processing or on-chain queries.

Since Cardano follows the eUTxO model, this approach ensures accurate tracking of both ADA (lovelace) and native tokens, providing a complete picture of an address's holdings at any point in time while maintaining a full transaction history.

:::info Balance Tracker Applications
A balance tracker serves as the foundation for:

- Wallet dashboards showing real-time assets
- Portfolio tracking applications
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
    decimal TokenAmount
) : IReducerModel;
```

#### How the DeFi Reducer Works

The `DexPoolByIdReducer` captures the dynamic activity of decentralized exchanges by monitoring specific transaction patterns:

- **Pool Tracking**: Monitors creation events and liquidity changes across different protocols.
- **Swap Analysis**: Records transaction details including amounts, direction, and price impact.
- **Rollback Handling**: Maintains historical pool states to ensure accuracy during chain rollbacks.

#### Data Utilization and Price Calculation

Once the DexPoolById table is populated, you can calculate the current price of Token A in terms of Token B using this simple formula:

```
Price of Token A (in Token B) = Token B Amount / Token A Amount
```

For example, in a real-world SNEK/ADA trading pair:

```
// If pool contains 10,000,000 SNEK tokens and 5,000 ADA
Price of 1 SNEK = 5,000 ADA / 10,000,000 SNEK

Actual Price of SNEK = 0.0005 ADA
```

This calculation enables applications to display real-time exchange rates directly from the indexed data without additional on-chain queries.

:::info DEX Reducer Capabilities
With this model structure, your application can:

- Track liquidity across multiple DEX protocols
- Calculate and compare swap prices in real-time
- Generate market depth charts for trading pairs
- Monitor token price fluctuations over time
- Calculate impermanent loss for liquidity providers
- Create price alerts based on predefined thresholds
- Identify arbitrage opportunities between different DEXs
- Analyze trading volumes and liquidity depth for specific token pairs
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
