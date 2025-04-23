---
id: intro
slug: /
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

![Argus logo](https://hackmd.io/_uploads/Hk7BL6R0kg.png)

# .NET Indexing Framework for Cardano

**Argus** is a .NET indexing framework for Cardano. It handles node communication, block parsing, and rollback events, so you can focus on implementing your domain logic.

---

## Why Argus?

- **Reliable Node Integration**: Supports Cardano’s chain-sync protocol over Unix socket or UTxO RPC.
- **Efficient Deserialization**: Maps CBOR-encoded blocks into clear, strongly-typed C# models.
- **Custom Reducers**: Implement one or more `IReducer` classes to process chain events exactly as you need.
- **Graceful Rollback Support**: Automatically rolls back to a previous state when the chain reorganizes.
- **Flexible Storage Options**: Use EF Core with PostgreSQL or integrate any other persistence mechanism.

---

## Core Concepts

### 1. Chain Sync

Argus establishes a streaming connection to a Cardano node, starting from a specified intersection:

```jsonc
{
  "Hash": "<startingBlockHash>",
  "Slot": <absoluteSlot>
}
```

It then handles two event types:

- **RollForward**: A new block is received and ready for processing.
- **RollBack**: A rollback event signals a fork or reorganization.

### 2. Data Deserialization

With **Chrysalis.CBOR**, Argus parses raw CBOR data into C# objects.

### 3. Reducers

Create `IReducer<TModel>` implementations for your application logic:

- `RollForwardAsync(Block block)`: Called for each new block.
- `RollBackwardAsync(ulong slot)`: Called when reverting state.

Your reducers see each block in sequence and can inspect, transform, and store data as needed.

### 4. State Persistence

Argus tracks each reducer’s progress in a `ReducerState` store. On startup, it resumes from the last recorded intersection, ensuring no data gaps.

---

## Workflow Overview

```text
Cardano Node (chain-sync)
       │
       ▼
Argus Chain Sync Worker
       │
┌──────┴──────┐
│ RollForward │
│ RollBack    │
└──────┬──────┘
       │
       ▼
     Reducers
       │
       ▼
   Data Store
```

This loop runs continuously, keeping your application in sync with the blockchain—even across forks.

---

Ready to start? Check out **Quickstart** to create your first reducer!
