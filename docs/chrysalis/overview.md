---
title: Overview
sidebar_position: 1
hide_title: true
---

![Chrysalis Banner](/img/docs/chrysalis/chrysalis-banner.webp)

# Chrysalis

A native .NET toolkit for Cardano blockchain development. CBOR serialization, transaction building, wallet management, Ouroboros mini-protocols, and a pure managed Plutus VM — everything you need to build on Cardano in .NET.

## Packages

| Package | Description |
|---|---|
| **Chrysalis.Codec** | Source-generated CBOR serialization — zero reflection, compile-time dispatch |
| **Chrysalis.Codec.CodeGen** | Roslyn source generator for CBOR serializers + CIP-0057 blueprint codegen |
| **Chrysalis.Network** | Ouroboros N2C/N2N mini-protocols with pipelined ChainSync + BlockFetch |
| **Chrysalis.Tx** | `TransactionBuilder`, `OutputBuilder`, `MintBuilder`, fee/collateral calculation |
| **Chrysalis.Plutus** | Pure C# UPLC interpreter — 999/999 conformance tests, no native dependencies |
| **Chrysalis.Wallet** | BIP-39 mnemonic, BIP-32 HD key derivation, Bech32 addresses |
| **Chrysalis.Crypto** | Ed25519 signatures, Blake2b hashing |

## Highlights

- **Blueprint Codegen** — drop an Aiken-compiled `plutus.json` into your project and get fully typed C# types at compile time, with byte-identical serialization to Aiken
- **Source-Generated CBOR** — no reflection, no runtime overhead. The Roslyn source generator emits Read/Write/Create methods at compile time
- **Pure Managed Plutus VM** — a complete UPLC/CEK interpreter in C#. No Haskell FFI, no Rust FFI, no native dependencies. 999/999 conformance tests including BLS12-381
- **Matches Rust on N2C** — Chrysalis matches Pallas (Rust) at ~3,050 blk/s on Unix socket chain sync. On N2N with pipelining, Chrysalis is 13x faster

## Era Support

| Era | Serialization | Block Processing | Tx Building | Script Eval |
|---|:---:|:---:|:---:|:---:|
| **Byron** | ✅ | ✅ | — | — |
| **Shelley** | ✅ | ✅ | ✅ | — |
| **Allegra** | ✅ | ✅ | ✅ | — |
| **Mary** | ✅ | ✅ | ✅ | — |
| **Alonzo** | ✅ | ✅ | ✅ | ✅ |
| **Babbage** | ✅ | ✅ | ✅ | ✅ |
| **Conway** | ✅ | ✅ | ✅ | ✅ |

## Quick Links

- [Getting Started](./getting-started) — install and build your first project in 5 minutes
- [Blueprint Codegen](./codec/blueprint-codegen) — auto-generate C# types from Aiken blueprints
- [Transaction Building](./transactions/low-level-builder) — fluent API for building and signing transactions
- [Plutus VM](./plutus/overview) — evaluate scripts with the pure C# UPLC interpreter
