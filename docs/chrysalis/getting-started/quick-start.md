---
title: Quick Start
sidebar_position: 2
hide_title: true
---

![Chrysalis Banner](/img/docs/chrysalis/banner.png)

---

This quick start guide will walk you through installing Chrysalis, setting up your development environment, and creating your first Cardano application step-by-step. You'll learn how to quickly integrate Chrysalis into your workflow, understand basic concepts, and build a foundational project.

---

## 📥 Installation

Chrysalis offers flexible installation options depending on your project needs. Whether you're building a comprehensive blockchain application or need specific functionality, you can choose between installing the complete toolkit or selecting individual modules to keep your project lean and optimized.

### Option 1: Install Complete Package

For most projects, install the main Chrysalis package which includes all modules:

```bash
dotnet add package Chrysalis
```

### Option 2: Install Individual Components

For optimized builds, install only the modules you need:

```bash
# CBOR serialization and deserialization
dotnet add package Chrysalis.Cbor

# Cardano node communication
dotnet add package Chrysalis.Network

# Transaction building and submission
dotnet add package Chrysalis.Tx

# Smart contract evaluation
dotnet add package Chrysalis.Plutus

# Wallet and key management
dotnet add package Chrysalis.Wallet
```

---

## 🚀 Quick Examples

These examples demonstrate the core functionality of Chrysalis, showcasing how to serialize Cardano data structures and manage wallets with just a few lines of code. Each example is production-ready and follows best practices for Cardano development, giving you a solid foundation to build upon.

### CBOR Serialization

Define and work with Cardano data structures:

```csharp
using Chrysalis.Cbor;

// Define CBOR-serializable types
[CborSerializable]
[CborConstr(0)]
public partial record AssetDetails(
    [CborOrder(0)] byte[] PolicyId,
    [CborOrder(1)] AssetClass Asset,
    [CborOrder(2)] ulong Amount
): CborBase;

// Deserialize from CBOR hex
var data = "d8799f581cc05cb5c5f43aac9d9e057286e094f60d09ae61e8962ad5c42196180c9f4040ff1a00989680ff";
AssetDetails details = CborSerializer.Deserialize<AssetDetails>(data);

// Serialize back to CBOR
byte[] serialized = CborSerializer.Serialize(details);
```

### Wallet Management

Create wallets and generate addresses:

```csharp
using Chrysalis.Wallet;
using Chrysalis.Core;

// Create wallet from mnemonic
var mnemonic = Mnemonic.Generate(English.Words, 24);

var accountKey = mnemonic
    .GetRootKey()
    .Derive(PurposeType.Shelley, DerivationType.HARD)
    .Derive(CoinType.Ada, DerivationType.HARD)
    .Derive(0, DerivationType.HARD);

var privateKey = accountKey
    .Derive(RoleType.ExternalChain)
    .Derive(0);

// Generate address
var address = Address.FromPublicKeys(
    NetworkType.Testnet,
    AddressType.BasePayment,
    paymentKey,
    stakingKey
);

string bech32Address = address.ToBech32();
```

---

## 📦 Package Overview

Understanding Chrysalis's modular architecture helps you choose the right components for your project, ensuring optimal performance and minimal dependencies. Each package is designed to work independently or seamlessly together, providing maximum flexibility for different use cases from simple wallets to complex DeFi applications.

| Package | Description | Use Case |
|---------|-------------|----------|
| **Chrysalis** | Complete toolkit | Full-featured applications |
| **Chrysalis.Cbor** | CBOR serialization | Data encoding/decoding |
| **Chrysalis.Network** | Node communication | Blockchain interaction |
| **Chrysalis.Tx** | Transaction building | Creating transactions |
| **Chrysalis.Plutus** | Smart contracts | Script evaluation |
| **Chrysalis.Wallet** | Key management | Address generation |

---

## Next Steps

- Explore [CBOR Serialization](../modules/cbor-handling) for working with Cardano data
- Learn [Transaction Building](../modules/transaction-building) patterns
- Understand [Wallet Management](../modules/wallet-management) best practices
- Connect to [Cardano Networks](../modules/network-connections) efficiently