---
title: Overview
sidebar_position: 1
---

# Overview

Chrysalis.Network is a C#/.NET library that fully implements Cardano’s Ouroboros network protocol by adhering directly to the official CDDL schemas and state machines. It offers native support for all core mini‑protocols—Handshake, ChainSync, LocalTxSubmission, LocalStateQuery, and LocalTxMonitor—over a single multiplexed session. The high‑level NodeClient API lets you quickly establish peer connections, negotiate versions, stream ledger updates, submit transactions, and query on‑chain state with minimal boilerplate.

# Mini‑Protocol Specifications

| Protocol                |  Purpose                                  |
| ----------------------- |  ---------------------------------------- |
| Handshake               |  Version negotiation                      |
| ChainSync               |  follows an upstream chain producer       |
| LocalTxSubmission       |  Submit a transaction from client to node |
| LocalStateQuery         |  Query node’s on-chain state              |
| LocalTxMonitor          |  Mempool status & notifications           |

---

## Basic Usage

```csharp
// Basic example for getting the tip of the network
NodeClient client = await NodeClient.ConnectAsync(_socketPath);
await client.StartAsync();
Tip tip = await client.LocalStateQuery.GetTipAsync();
```
