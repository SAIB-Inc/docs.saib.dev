---
title: Applications and Use Cases
sidebar_position: 2
hide_title: true
---

![Argus Applications Banner](/img/docs/argus/guides-and-tutorials/argus-application-banner.webp)

<br/>

This guide explores practical applications of Argus and provides best practices for integrating it into your Cardano blockchain projects. You'll discover real-world use cases and implementation patterns that leverage Argus' powerful indexing capabilities.

## Example Use Cases

Argus' flexible architecture makes it suitable for a wide range of blockchain applications. Here are some concrete examples with implementation details.

### Balance By Address Reducer

Want to track the current active balance of addresses on the blockchain? Let's design a model to handle this:

```csharp
// Balance by address model
public record BalanceByAddress(
    string Address,      // The wallet address
    decimal LovelaceAmount,  // Amount in lovelace
    Dictionary<string, long> Tokens, // Native token balances
    DateTime LastUpdated     // When balance was last modified
) : IReducerModel;
```

#### How the Balance Reducer Works

The balance tracking system monitors blockchain transactions to maintain up-to-date records of address balances:

1. **Input/Output Processing**: The reducer analyzes transaction inputs and outputs to identify address balance changes
2. **Token Accounting**: When native tokens are detected, the system updates the token dictionary with current quantities
3. **UTxO Management**: The system tracks unspent transaction outputs to calculate accurate balances
4. **Rollback Handling**: During chain reorganizations, the system can reconstruct previous balance states by reversing transactions

When a transaction occurs on the blockchain, the balance tracker processes each input (source of funds) and output (destination of funds), adjusting the relevant address balances accordingly. It keeps track of both ADA (lovelace) and native tokens, providing a complete picture of an address's holdings at any point in time.
<br/>
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
public record DexPool(
    string PoolId,
    string TokenA,
    string TokenB,
    decimal TokenAAmount
) : IReducerModel;

// Swap transaction model
public record SwapTransaction(
    string TxHash,
    string PoolId,
    string SwapType, // "AtoB" or "BtoA"
    decimal AmountIn,
    decimal AmountOut
) : IReducerModel;
```

#### How the DeFi Tracker Works

The `DexActivityReducer` captures the dynamic activity of decentralized exchanges by monitoring specific transaction patterns:

- **Protocol Detection**: Identifies DEX-related operations by analyzing transaction metadata and script execution
- **Pool Tracking**: Monitors creation events and liquidity changes across different protocols
- **Swap Analysis**: Records transaction details including amounts, direction, and price impact
- **Rollback Handling**: Maintains historical pool states to ensure accuracy during chain reorganizations

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
public record NftAsset(
    string PolicyId,
    string AssetName,
    string CurrentOwner,
    Dictionary<string, string> Metadata,
    ulong TransactionSlot
) : IReducerModel;

// NFT transaction model
public record NftTransaction(
    string TxHash,
    int TxIndex,
    string FromAddress,
    string ToAddress,
    decimal PaymentAmount,
    ulong TransactionSlot,
    string TransactionType // "Mint", "Transfer", "Sale", "Burn"
) : IReducerModel;
```

#### How the NFT Asset Reducer Works

The NFT Asset Reducer monitors the complete lifecycle of individual NFTs on the blockchain:

1. **Mint Tracking**: The system detects when new NFTs are created, capturing their original metadata and initial owner
2. **Ownership Changes**: Every time an NFT changes hands, the tracker updates ownership records and transaction history
3. **Metadata Extraction**: The tracker extracts and stores on-chain metadata associated with each NFT asset
4. **Transaction Classification**: The system categorizes transactions as mints, transfers, sales, or burns based on transaction patterns

This approach focuses on tracking the history of each individual asset. During an NFT transaction, the system reviews the entire transaction context to identify the transfer type. It distinguishes between simple transfers (no payment) and sales (with ADA payment), generating a comprehensive provenance record for each unique token.
<br/>
:::info NFT Asset Tracking Applications
With this individual asset-focused approach, you can build features like:
- Complete provenance records for each NFT from mint to current state
- Ownership verification and history validation
- Individual asset valuation based on transaction history
- Metadata exploration and visualization
- Royalty distribution tracking for creators
:::

## Argus Integration Best Practices

### Effective Reducer Design

**Use slot-based tracking**:
```csharp
// Store the slot with each record for rollback support
public record TokenTransfer(
    string TxHash,
    int TxIndex,
    ulong Slot,      // Critical for chain rollback handling
    string PolicyId,
    string AssetName,
    string FromAddress,
    string ToAddress,
    ulong Amount,
    ulong Lovelace
) : IReducerModel;
```

:::info Rollback Handling
Storing the block slot with each record is essential for Argus' chain rollback handling:
- Slot numbers uniquely identify blockchain positions
- During rollbacks, Argus provides the exact slot to roll back to
- All records with slots greater than the rollback point must be reversed
:::

Storing the block slot with each record is crucial for Argus’s effective chain rollback management, as slot numbers uniquely mark blockchain positions. This allows Argus to precisely identify rollback points and reverse all records from slots beyond the rollback, ensuring accurate state restoration.
<br/>
**Maintain data integrity with Argus’s transactional processing:**

```csharp
public async Task RollForwardAsync(Block block)
{
    using var db = dbContextFactory.CreateDbContext();
    
    // Process all operations within the same transaction
    foreach (var tx in block.TransactionBodies())
    {
        // All these operations will be committed atomically
        ProcessInputs(db, tx);
        ProcessOutputs(db, tx);
        ProcessMetadata(db, tx);
    }
    
    await db.SaveChangesAsync();
}
```

:::info Transaction Consistency
Argus provides important transaction guarantees:
- Each block is processed in an isolated transaction
- All your reducers are synchronized to maintain cross-entity consistency
:::

Argus ensures robust transaction guarantees by processing each block within an isolated transaction and synchronizing all reducers to maintain consistent state across multiple entities. This approach provides reliable and consistent data handling essential for blockchain applications.

### Argus-Specific Data Patterns

**Use dual-state architecture for Cardano's UTxO model:**

```csharp
// Active state - current balances
public class ActiveUtxo
{
    public string TxHash { get; set; }  // Transaction hash
    public int Index { get; set; }      // Output index
    public string Address { get; set; } // Owner address
    public long Lovelace { get; set; }  // ADA amount in lovelace
    public string[] Assets { get; set; } // Native tokens
    public ulong Slot { get; set; } // Block slot
}

// History state - all transactions
public class HistoricalUtxo 
{
    public string TxHash { get; set; }
    public int Index { get; set; }
    public string OutRef { get; set; } // Consumed UTxO
    public string Address { get; set; }
    public long Lovelace { get; set; }
    public string[] Assets { get; set; }
    public ulong Slot { get; set; }
}
```

:::info Dual-State Architecture
This dual-state approach aligns perfectly with Cardano's UTxO model:
- **Active State**: Tracks the current UTxO (unspent output)
- **History State**: Records a transaction that has been executed
:::

This dual-state approach complements Cardano’s UTxO model by maintaining an Active State for tracking current unspent outputs and a History State for recording completed transactions, ensuring accurate and efficient ledger management.

### Event-Driven Architecture

**Implement an event-driven architecture that broadcasts blockchain events:**

```csharp
public async Task RollForwardAsync(Block block)
{
    foreach (var tx in block.TransactionBodies())
    {
        // Check for specific patterns
        if (IsNftSale(tx))
        {
            var saleEvent = ExtractNftSaleDetails(tx);
            await eventPublisher.PublishAsync("nft.sale", saleEvent);
        }
        
        if (IsDexSwap(tx))
        {
            var swapEvent = ExtractSwapDetails(tx);
            await eventPublisher.PublishAsync("dex.swap", swapEvent);
        }
    }
}
```
:::info Pattern Design
This implements an event-driven pattern that processes each transaction in a block, detects specific types like NFT sales or DEX swaps, and asynchronously publishes corresponding events:
- Push notifications for wallet activity
- Real-time trading dashboards
- Live market data feeds
- Webhook integrations with external systems
:::

This event-driven pattern processes each transaction within a block to identify specific activities like NFT sales or DEX swaps, then asynchronously publishes events that power features such as wallet push notifications, real-time trading dashboards, live market data feeds, and webhook integrations with external systems.
