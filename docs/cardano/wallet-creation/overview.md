---
title: Overview
sidebar_position: 1
---

# Wallet Creation Overview

Creating a Cardano wallet is essential for interacting with the blockchain, whether you're developing applications, managing ADA, or working with native tokens. This section covers different approaches to wallet creation, from using command-line tools to leveraging powerful .NET libraries.

---

## Prerequisites

Before starting with wallet creation:

- **For CLI approach**: cardano-cli installed and accessible
- **For Chrysalis**: .NET 6.0 or later, NuGet package manager
- Basic understanding of public/private key cryptography
- Familiarity with Cardano's UTXO model

---

## Wallet Creation Methods

### Command Line Interface (CLI)

The **cardano-cli** provides direct, low-level control over wallet operations. It works together with your running cardano-node to query blockchain data, check balances, and submit transactions. This approach is ideal for developers who need precise control over key generation, address derivation, and transaction building, though it requires understanding of Cardano's underlying concepts and careful key management.

:::note
cardano-cli comes bundled with the cardano-node binary when downloaded from the [official IOHK releases](https://github.com/input-output-hk/cardano-node/releases), so if you've already installed cardano-node from the releases page, you have cardano-cli available.
:::

### Chrysalis.Wallet Library

**[Chrysalis.Wallet](https://github.com/Saib-Inc/Chrysalis)** is SAIB's .NET library that simplifies wallet operations for C# developers. It provides a high-level, type-safe API for wallet creation, transaction building, and blockchain interaction, making Cardano development more accessible to .NET developers.

---

## Choosing Your Approach

### Use cardano-cli when:
- You need direct control over cryptographic operations
- Building scripts or automation tools
- Learning Cardano's fundamental concepts
- Operating in restricted environments

### Use Chrysalis.Wallet when:
- Developing .NET applications
- You want type-safe, object-oriented APIs
- Building enterprise solutions
- Need simplified wallet management

---

## What You'll Learn

In this section, you'll discover:

1. **Payment and Stake Keys**: How to generate key pairs for wallet operations
2. **Address Generation**: Creating payment addresses and base addresses from keys
3. **HD Wallet Creation**: Using recovery phrases for hierarchical deterministic wallets
4. **Chrysalis.Wallet Integration**: Building wallets programmatically with .NET
5. **Balance Queries**: Checking wallet balances and UTxOs using both CLI and Chrysalis

---

## Next Steps

Choose your preferred method to get started:

- [Create Wallet with CLI](./cardano-cli-wallet) - Learn the fundamentals with command-line tools
- [Use Chrysalis.Wallet](./chrysalis-wallet) - Build wallets programmatically with .NET