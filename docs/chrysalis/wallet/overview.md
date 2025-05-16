---
title: Overview
sidebar_position: 1
---

# Chrysalis.Wallet Overview

Chrysalis.Wallet is a comprehensive, CIP-compliant .NET library delivering end-to-end Cardano wallet functionality. It’s organized into:

- **Wordlists**: Built-in BIP-39 English wordlist for mnemonic generation and restoration.
- **Utilities**: Core algorithms for address handling (`Bech32Util`), key derivation math (`Bip32Util`), and hashing (`HashUtil`).
- **Models**: Strongly-typed types for `Address`, credentials, enums, key structures, and network metadata (`NetworkInfo`).

This modular structure lets you:

1. **Generate & Restore Mnemonics** (CIP-39/CIP-3) with `Mnemonic.Generate` and `Mnemonic.Restore`.
2. **Derive HD Keys** along the `m/1852'/1815'/account'/role/index` path (CIP-1852/1853).
3. **Construct & Parse Addresses** seamlessly via `new Address(...)`, which auto-detects formats and extracts payment/stake credentials.
4. **Work with Core Cryptography** under the hood, including Blake2b hashing and Bech32 checksums.

Whether you’re building wallets, signing transactions, or integrating on-chain metadata, Chrysalis.Wallet equips you with CIP-driven APIs, robust performance, and seamless integration into any .NET project.





