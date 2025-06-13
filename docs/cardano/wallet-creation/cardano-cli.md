---
title: Cardano CLI
sidebar_position: 2
---

# Create Wallet with Cardano CLI

This guide walks you through creating a Cardano wallet using cardano-cli, from generating keys to deriving addresses and managing your wallet securely.

---

## Understanding Wallet Components

Before creating a wallet, it's important to understand the key components that make up a Cardano wallet. Each component serves a specific purpose in the wallet's functionality, from controlling funds to earning staking rewards.

| Component | Description |
|-----------|-------------|
| **Root Key** | Master key from which all other keys are derived |
| **Payment Keys** | Used for sending and receiving ADA |
| **Stake Keys** | Used for delegation and earning rewards |
| **Addresses** | Derived from payment and stake keys |

---

## Generate Payment Keys

Payment keys are the foundation of your Cardano wallet, enabling you to send and receive ADA. Every wallet needs at least one payment key pair consisting of a signing key (private) and verification key (public). The signing key must be kept secret as it controls your funds, while the verification key is used to derive your wallet address that you can share with others.

### Step 1: Create Payment Key Pair

Generate a payment signing key and verification key:

```bash
# Create directory for wallet files
mkdir -p ~/cardano-wallet/keys

# Generate payment key pair
cardano-cli address key-gen \
  --signing-key-file ~/cardano-wallet/keys/payment.skey \
  --verification-key-file ~/cardano-wallet/keys/payment.vkey
```

### Step 2: Extract Payment Address

Derive a payment address from your verification key:

```bash
# For mainnet
cardano-cli address build \
  --payment-verification-key-file ~/cardano-wallet/keys/payment.vkey \
  --mainnet \
  --out-file ~/cardano-wallet/keys/payment.addr

# For testnet
cardano-cli address build \
  --payment-verification-key-file ~/cardano-wallet/keys/payment.vkey \
  --testnet-magic 2 \
  --out-file ~/cardano-wallet/keys/payment.addr
```

### Step 3: View Your Payment Address

Your payment address is now ready to use. You can view it with:

```bash
# Display your payment address
cat ~/cardano-wallet/keys/payment.addr

# Example output:
# addr1vx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzers66hrl8
```

:::info
This is a basic payment address that can receive ADA but doesn't include staking capabilities. For most use cases, you'll want to use the base address (created in the next section) which includes both payment and stake credentials.
:::

---

## Generate Stake Keys

Stake keys enable you to participate in Cardano's proof-of-stake consensus by delegating to stake pools and earning rewards. By combining stake keys with payment keys, you create a base address that supports both transactions and staking operations. This section shows how to generate stake keys and create a fully functional wallet address.

### Step 1: Create Stake Key Pair

Generate stake keys for delegation:

```bash
# Generate stake key pair
cardano-cli stake-address key-gen \
  --signing-key-file ~/cardano-wallet/keys/stake.skey \
  --verification-key-file ~/cardano-wallet/keys/stake.vkey
```

### Step 2: Build Base Address

Create a base address combining payment and stake keys:

```bash
# For mainnet
cardano-cli address build \
  --payment-verification-key-file ~/cardano-wallet/keys/payment.vkey \
  --stake-verification-key-file ~/cardano-wallet/keys/stake.vkey \
  --mainnet \
  --out-file ~/cardano-wallet/keys/base.addr

# For testnet
cardano-cli address build \
  --payment-verification-key-file ~/cardano-wallet/keys/payment.vkey \
  --stake-verification-key-file ~/cardano-wallet/keys/stake.vkey \
  --testnet-magic 2 \
  --out-file ~/cardano-wallet/keys/base.addr
```

### Step 3: View Your Wallet Address

Now that your address is generated, you can view it and start using it to receive funds:

```bash
# Display your wallet address
cat ~/cardano-wallet/keys/base.addr

# Example output:
# addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x
```

This is your complete wallet address that you can share with others to receive ADA. The base address combines both payment and stake credentials, allowing you to receive funds and earn staking rewards.

---

## HD Wallet Generation

Hierarchical Deterministic (HD) wallets allow you to generate multiple addresses from a single recovery phrase, following the BIP39 standard. This approach provides better security and backup options compared to managing individual key pairs. With HD wallets, you can recover all your addresses using just the recovery phrase, making it ideal for managing multiple accounts and addresses.

### Step 1: Generate Recovery Phrase

The recovery phrase (also called mnemonic or seed phrase) is a human-readable representation of your wallet's master key. This 24-word phrase can regenerate all your wallet's keys and addresses, so it must be stored securely.

```bash
# Generate 24-word mnemonic (requires cardano-wallet CLI)
cardano-wallet recovery-phrase generate --size 24 > ~/cardano-wallet/keys/recovery-phrase.txt

# IMPORTANT: Store this phrase securely!
```

### Step 2: Derive Root Key

Once you have your recovery phrase, you need to convert it into a root key that cardano-cli can use. This root key serves as the master key from which all child keys (payment and stake keys) are derived following the HD wallet structure.

```bash
# Convert recovery phrase to root key
cat ~/cardano-wallet/keys/recovery-phrase.txt | \
cardano-cli key convert-cardano-address-key \
  --signing-key-file /dev/stdin \
  --shelley-payment \
  --signing-key-file ~/cardano-wallet/keys/root.skey
```

---

## Next Steps

Now that you have a wallet:

1. **Fund your wallet** from an exchange or faucet (for testnet)
2. **Learn transaction building** with cardano-cli
3. **Explore stake delegation** to earn rewards
4. **Consider Chrysalis.Wallet** for programmatic wallet management