---
title: Cardano CLI
sidebar_position: 3
hide_title: true
---

# Cardano CLI Quick Start

## Prerequisites

- Cardano Node – running or accessible on your machine
- Cardano CLI – the command-line interface to the node
- Basic Cardano concepts – e.g., UTxO model, network magic, keys & addresses

---

## Generating Keys and Addresses

:::info
For a complete overview of Cardano address types, read [CIP-19](https://cips.cardano.org/cip/CIP-19).
:::

### Generating payment key pairs

To generate a payment key pair, run:

```bash
cardano-cli latest address key-gen \
--verification-key-file payment.vkey \
--signing-key-file payment.skey
```

To generate a stake key pair, run:

```bash
cardano-cli latest stake-address key-gen \
--verification-key-file stake.vkey \
--signing-key-file stake.skey
```

:::info
- An address has two parts — Payment and Delegation (or Stake) part.
- Having a stake part of an address is purely optional. 
- However, the address you will build without the stake part will have no staking rights thus cannot delegate or receive rewards. Your address will then only have the payment part.
- That means you can actually skip the stake key pair generation and all will still be good if you only need to do pure transactions!
:::

### Building an address

To build an address using the payment key pairs only, run:

```bash
cardano-cli latest address build \
--payment-verification-key-file payment.vkey \
--out-file paymentNoStake.addr
```

To build an address with both payment and stake parts, run:

```bash
cardano-cli address build \
--payment-verification-key-file payment.vkey \
--stake-verification-key-file stake.vkey \
--out-file paymentWithStake.addr
```

Try displaying your generated address:

```bash
cat payment.addr

// `addr_test` means you have a Testnet Address. Mainnet addresses start with `addr`.
addr_test1qzdtyyt48yrn2fa3wvh939rat0gyv6ly0ljt449sw8tppzrcc3g0zu63cp6rnjumfcadft63x3w8ds4u28z6zlvra4fqy2sm8n
```

---

## Verify your address by querying your address balance

```bash
cardano-cli query utxo --address $(< paymentNoStake.addr)

                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
262c7891f932cde390bcc04c25805f3f422c1a5687d5d47f6681e68bb384fe6d     0        10000000000 lovelace + TxOutDatumNone
```

:::tip
- If the list is empty, you probably don't have a UTxO yet which is normal with newly generated addresses.
- You can get test tokens for pre-production and preview testnets in this [Testnet Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet)
- For SanchoNet tokens, go to the [SanchoNet faucet](https://sancho.network/faucet).
:::

---
