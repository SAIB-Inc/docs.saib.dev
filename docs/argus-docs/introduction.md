---
title: Introduction
sidebar_label: Introduction
sidebar_position: 1
slug: /
---

![darkmodeAsset](https://hackmd.io/_uploads/Hk7BL6R0kg.png)

Welcome to **Argus**, a .NET indexing framework for the Cardano blockchain.

---

## What Is Argus?

Argus is an open-source indexer powered by the Chrysalis .NET libraries. It provides a modular pipeline for ingesting, interpreting, and storing Cardano on-chain data without manual protocol or serialization handling.

- **Data ingestion**  
  Uses `Chrysalis.Network` to synchronize with a Cardano node over the Ouroboros chain-sync protocol.

- **CBOR deserialization**  
  Applies built-in mappers to convert raw CBOR payloads into strongly-typed C# objects.

- **Indexer callbacks**  
  Invokes `Rollforward` for each new block and `Rollback` when the chain reorganizes. Implement your indexer by handling these methods to process data as needed.

- **Data persistence**  
  Provides a default implementation using Entity Framework Core (the ORM) with a PostgreSQL database for storing indexed records.

## Why Use Argus?

Building a Cardano indexer requires solving several core challenges:

1. **Node setup and connectivity**  
   Configuring node endpoints, managing chain-sync connections, and handling reconnections or network errors.
2. **CBOR decoding**  
   Translating raw CBOR payloads into application-specific C# types.
3. **Database management**  
   Defining database schemas, applying migrations, and ensuring reliable data storage.

Argus addresses these through dedicated modules:

- **Network module** (`Chrysalis.Network`) for protocol negotiation and synchronizing blocks.
- **Mapping module** for CBOR-to-C# translation of common Cardano structures.
- **Callback API** (`Rollforward`/`Rollback`) to plug in domain logic at each block update.
- **Persistence module** offering EF Core integration with PostgreSQL out of the box.

By focusing only on your domain-specific logic within `Rollforward` and `Rollback`, you bypass boilerplate setup and concentrate on the indexed data your application needs.
