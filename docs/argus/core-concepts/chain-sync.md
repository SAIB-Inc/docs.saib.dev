---
title: Chain-Sync Protocol
sidebar_position: 2
hide_title: true
---

![Blockchain Concepts Banner](/img/docs/argus/core-concepts/chain-sync-protocol-banner.webp)

This document explains the ChainSync protocol and its role in Argus. Understanding ChainSync helps you better configure and use Argus for your blockchain applications.

---

## Chain-Sync Fundamentals

### Blocks and the Chain Structure

At its core, a blockchain is a sequence of blocks linked together cryptographically, forming a chain of data.

:::info What is a Block?
A block in Cardano contains:

- **Header**: Metadata about the block (hash, number, slot, issuer)
- **Transaction Bodies**: Actions that change the ledger state
- **Transaction Witness Sets**: Signatures and scripts that validate transactions
- **Auxiliary Data**: Optional metadata attached to transactions
  :::

Blocks are produced at regular intervals (about 20 seconds in Cardano) and are identified by:

- **Slot Number**: A monotonically increasing counter representing time
- **Block Hash**: A unique cryptographic identifier derived from the block's contents

```
┌───────────┐      ┌───────────┐      ┌───────────┐
│  Block 1  │      │  Block 2  │      │  Block 3  │
│           │──────►           │──────►           │
│ Slot: 100 │      │ Slot: 101 │      │ Slot: 102 │
└───────────┘      └───────────┘      └───────────┘
```

<details>
<summary><strong>Why Blocks Matter for Argus</strong></summary>

Argus processes blocks sequentially to update your database. Each block represents a specific point in history, with:

- A guaranteed order of transactions
- A timestamp (via its slot number)
- Changes to the ledger state

When you implement reducers in Argus, you're defining how to transform block data into useful information for your application.

</details>

### Transactions and the UTxO Model

Cardano uses an extended Unspent Transaction Output (eUTxO) model, which differs from account-based blockchains.

:::info Understanding Transactions and UTxOs

- **Transaction**: A record of value transfer that consumes existing UTxOs as inputs and creates new UTxOs as outputs
- **UTxO (Unspent Transaction Output)**: An "unspent coin" that can be used in a future transaction
- Each UTxO includes an address (owner), value (amount), and optional data (for smart contracts)
  :::

```
Transaction Structure:
┌─────────────────┐     ┌─────────────────┐
│     Inputs      │     │     Outputs     │
│  (UTxOs spent)  │     │ (UTxOs created) │
└─────────────────┘     └─────────────────┘
        Fee: 0.17 ADA
        Metadata: {...}
        Scripts: {...}
```

<details>
<summary><strong>eUTxO vs. Account Model</strong></summary>

Unlike account-based models (like Ethereum) where you have balances, in Cardano:

- You don't have a single "balance" - you have a collection of UTxOs
- Each transaction must consume entire UTxOs and create new ones
- This design enables more predictable transaction outcomes and better parallelism

When Argus indexes address balances, it's actually tracking all UTxOs associated with that address.

</details>

---

## Synchronization Concepts

### Chain History and State

Blockchain data can be viewed in two ways:

1. **Historical Data**: The complete sequence of all blocks and transactions (the chain)
2. **Current State**: The current set of all UTxOs, stake registrations, and other active records

Argus primarily works with historical data, indexing it into structured formats that make both historical analysis and current state queries efficient.

### Chain Reorganizations

Occasionally, the blockchain may fork temporarily when two valid blocks are produced nearly simultaneously, requiring nodes to decide which chain to follow.

:::info What is a Chain Reorganization?
A chain reorganization ("reorg") happens when:

1. The blockchain temporarily splits into two valid chains
2. One chain eventually becomes the canonical chain
3. Nodes following the other chain must "roll back" and switch to the canonical chain

This is a normal part of distributed consensus - Argus handles this automatically through its rollback mechanisms.
:::

```
                      ┌─────┐      ┌─────┐
                      │ B-2 │──────► B-3 │  (abandoned)
                     ↗└─────┘      └─────┘
┌─────┐      ┌─────┐
│ B-0 │──────► B-1 │
└─────┘      └─────┘
                     ↘┌─────┐      ┌─────┐      ┌─────┐
                      │ C-2 │──────► C-3 │──────► C-4 │  (canonical)
                      └─────┘      └─────┘      └─────┘
```

<details>
<summary><strong>How Argus Handles Reorgs</strong></summary>

When a reorg occurs, Argus:

1. Receives a rollback notification with a slot number
2. Calls `RollBackwardAsync` on all reducers to revert database state
3. Processes the new canonical blocks via `RollForwardAsync`

This ensures your database always reflects the canonical chain state.

</details>

---

## The Chain-Sync Protocol

Now that we understand the basic blockchain concepts, we can introduce Chain-Sync - the protocol that enables Argus to receive block data from the Cardano network.

### What is Chain-Sync?

Chain-Sync is a Cardano network protocol that allows applications to request and receive blockchain updates in a standardized way.

:::info Chain-Sync's Role in Argus
Chain-Sync is what powers Argus's ability to:

- Receive new blocks as they're produced
- Handle chain reorganizations
- Resume synchronization after restarts
- Maintain consistency with the canonical blockchain
  :::

### How Chain-Sync Works with Argus

When you run Argus, it establishes a Chain-Sync connection to a Cardano node and:

1. **Finds an Intersection Point**: Determines where to start/resume synchronization
2. **Requests Blocks Sequentially**: Receives blocks in order from that point
3. **Processes Through Reducers**: Passes each block to your reducers for processing
4. **Handles Rollbacks When Needed**: Manages chain reorganizations automatically

```
┌────────────┐    ┌───────────────────┐    ┌───────────────┐
│  Cardano   │    │                   │    │    Argus      │
│   Node     ├────►  Chain-Sync Flow   ├────►  (Reducers &  │
│            │    │                   │    │   Database)   │
└────────────┘    └───────────────────┘    └───────────────┘
```

---

## Practical Implications for Your Applications

Understanding these core concepts helps you effectively use Argus for different use cases:

### Tracking Assets and Balances

Since Cardano uses the UTxO model, tracking an address's balance means:

- Monitoring all transactions that create outputs for that address
- Monitoring all transactions that spend outputs from that address
- Calculating the current balance from unspent outputs

Argus's built-in reducers like `BalanceByAddressReducer` handle this complexity for you.

### Working with Smart Contracts

For dApps and smart contracts, you'll often need to:

- Track specific script addresses
- Index datums and redeemers
- Monitor for specific contract patterns

Your custom reducers can extract this data during synchronization, making it available for your application to query.

### Real-time Data Processing

Chain-Sync enables Argus to process blocks with minimal delay after they're produced on the network. This means:

- Your database stays current with the blockchain
- Applications can display near real-time information
- You can trigger business logic based on on-chain events

---

By understanding these foundational concepts - blocks, transactions, UTxOs, chain reorganizations, and how Chain-Sync delivers this data to Argus - you'll be better equipped to design effective indexing solutions and build applications on top of the indexed data.
