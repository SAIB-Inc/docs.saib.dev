---
title: Cardano CLI
sidebar_position: 3
hide_title: true
---

# Cardano CLI Quick Start

## Prerequisites

- **Cardano Node** – running and synchronized with your chosen network
- **Cardano CLI** – command-line interface (version 8.0+ for Conway era support)
- **Understanding** – Basic knowledge of UTxO model and public key cryptography

---

## Environment Setup

Configure these environment variables:

```bash
# Path to your node socket
export CARDANO_NODE_SOCKET_PATH=/path/to/node.socket

# Network ID 
export CARDANO_NODE_NETWORK_ID=2        # Preview testnet (recommended for testing)
# export CARDANO_NODE_NETWORK_ID=1      # Preprod testnet
# export CARDANO_NODE_NETWORK_ID=4      # SanchoNet
# export CARDANO_NODE_NETWORK_ID=mainnet  # Mainnet
```

:::note
While these environment variables are standard, some commands may still require explicit `--testnet-magic` and `--socket-path` flags depending on your CLI version.
:::

Verify connection:

```bash
cardano-cli latest query tip --testnet-magic 2
```

---

## Key Generation

Cardano uses Ed25519 cryptographic keys for securing funds and controlling stake delegation.

### Payment Keys

Payment keys control spending of UTxOs. Generate a payment key pair:

```bash
cardano-cli latest address key-gen \
  --verification-key-file payment.vkey \
  --signing-key-file payment.skey
```

This creates:
- **`payment.skey`** – Private signing key (keep secure!)
- **`payment.vkey`** – Public verification key

### Stake Keys

Stake keys control delegation and reward withdrawal:

```bash
cardano-cli latest stake-address key-gen \
  --verification-key-file stake.vkey \
  --signing-key-file stake.skey
```

### Key File Format

Standard keys are stored as JSON text envelopes:

```json
{
    "type": "PaymentVerificationKeyShelley_ed25519",
    "description": "Payment Verification Key",
    "cborHex": "5820..."
}
```

For programmatic use, you can extract key hashes:

```bash
cardano-cli latest address key-hash \
  --payment-verification-key-file payment.vkey
```

---

## Building Addresses

Cardano addresses encode payment and optional delegation rights. See [CIP-19](https://cips.cardano.org/cip/CIP-19) for the full specification.

### Enterprise Address (Type 6)

Payment-only address without staking capability:

```bash
cardano-cli latest address build \
  --payment-verification-key-file payment.vkey \
  --out-file payment.addr \
  --testnet-magic 2
```

Use cases:
- Exchange hot wallets
- Smart contract addresses  
- Simple payment flows

### Base Address (Type 0)

Full address with payment and delegation parts:

```bash
cardano-cli latest address build \
  --payment-verification-key-file payment.vkey \
  --stake-verification-key-file stake.vkey \
  --out-file payment_stake.addr \
  --testnet-magic 2
```

Benefits:
- Can receive staking rewards
- Participate in delegation
- Standard for user wallets

### Network Selection

Specify the target network:

```bash
# Preview testnet
--testnet-magic 2

# Preprod testnet  
--testnet-magic 1

# SanchoNet (Conway testnet)
--testnet-magic 4

# Mainnet
--mainnet
```

### Address Format

View your generated address:

```bash
cat payment.addr
```

Address prefixes indicate network:

| Prefix         | Type            | Network |
| -------------- | --------------- | ------- |
| `addr1...`     | Payment address | Mainnet |
| `addr_test1...`| Payment address | Testnet |
| `stake1...`    | Stake address   | Mainnet |
| `stake_test1...`| Stake address  | Testnet |

Example testnet addresses:

```
# Enterprise (no stake)
addr_test1vrqlsnsuz5j9kv8dp5s80pt0cgrm4m35kq0jxqw3usk7f8que2vlk

# Base (with stake)  
addr_test1qrqlsnsuz5j9kv8dp5s80pt0cgrm4m35kq0jxqw3usk7f8qhk0cxs4hnx7qpmsg4wwzrppt0atpjx7qyddep496mnecsr7f2g9
```

---

## Querying the Blockchain

### Check UTxOs

Query unspent outputs at your address:

```bash
cardano-cli latest query utxo \
  --address $(cat payment.addr) \
  --testnet-magic 2
```

Output format:
```
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
262c7891f932cde390bcc04c25805f3f422c1a5687d5d47f6681e68bb384fe6d     0        10000000000 lovelace + TxOutDatumNone
```

For programmatic use, request JSON output:

```bash
cardano-cli latest query utxo \
  --address $(cat payment.addr) \
  --testnet-magic 2 \
  --output-json | jq
```

### Node Connection

Queries require a running node. Set the socket path:

```bash
export CARDANO_NODE_SOCKET_PATH=/path/to/node.socket
```

Or specify explicitly:

```bash
cardano-cli latest query utxo \
  --address $(cat payment.addr) \
  --testnet-magic 2 \
  --socket-path /path/to/node.socket
```

---

## Getting Test ADA

For new addresses without UTxOs:

1. **Preview/Preprod Testnets**
   - [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet)
   - Provides test ADA via web interface

2. **SanchoNet (Conway Features)**
   - [SanchoNet Faucet](https://sancho.network/faucet)
   - For testing governance and Conway era features

3. **Verification**
   ```bash
   # After requesting funds, verify receipt
   cardano-cli latest query utxo \
     --address $(cat payment.addr) \
     --testnet-magic 2
   ```

---

## Next Steps

- [Simple Transactions](../transaction-building/simple-tx) – Build and submit transactions

---