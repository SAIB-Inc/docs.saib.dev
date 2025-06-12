---
title: Simple Transactions
sidebar_position: 1
hide_title: true
---

# Simple Transactions

## Prerequisites

- **Cardano Node** – running and fully synchronized
- **Cardano CLI** – command-line interface to the node
- **Payment address with funds** – see [Cardano CLI Quick Start](../getting-started/cardano-cli)
- **Environment** – Variables set as shown in [Environment Setup](../getting-started/cardano-cli#environment-setup)

---

## Understanding Cardano Transactions

### UTxO Model

Cardano uses the Unspent Transaction Output (UTxO) model. Each UTxO represents coins that can be spent and is uniquely identified by:
- **Transaction hash** (TxHash) – The ID of the transaction that created it  
- **Output index** (TxIx) – Position in that transaction's outputs (starts at 0)

Format: `TxHash#TxIx` (e.g., `4694ed...366b#0`)

### Transaction Structure

Every transaction must:
1. **Consume entire UTxOs** – You can't partially spend a UTxO
2. **Create new UTxOs** – Including change back to yourself
3. **Pay fees** – Deducted from the total inputs
4. **Balance perfectly** – `sum(inputs) = sum(outputs) + fee`

### Build Methods

| Method      | Fee Calculation | Node Required | Use Case                            |
| ----------- | --------------- | ------------- | ----------------------------------- |
| `build-raw` | Manual          | No (offline)  | Air-gapped signing, precise control |
| `build`     | Automatic       | Yes           | Quick transactions, convenience     |

---

## Method 1: Using build-raw (Manual)

### Step 1: Query Protocol Parameters

```bash
cardano-cli latest query protocol-parameters --out-file pparams.json
```

### Step 2: Find Your UTxOs

```bash
cardano-cli latest query utxo --address $(cat payment.addr)
```

Example output:
```
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
4694eddc13d7fab25722acc0a35bfdca4435a3b99830fb1723cb2e94478d366b     0        10000000000 lovelace + TxOutDatumNone
```

### Step 3: Build Draft Transaction

To send 1,000 ADA (1,000,000,000 lovelace) to another address:

```bash
cardano-cli latest transaction build-raw \
  --tx-in 4694eddc13d7fab25722acc0a35bfdca4435a3b99830fb1723cb2e94478d366b#0 \
  --tx-out "$(cat payment2.addr)+1000000000" \
  --tx-out "$(cat payment1.addr)+9000000000" \
  --fee 0 \
  --protocol-params-file pparams.json \
  --out-file tx.draft
```

### Step 4: Calculate Minimum Fee

:::warning Fee Calculation Issue
The `calculate-min-fee` command has a known issue where using `--fee 0` can result in underestimated fees. This happens because CBOR encoding uses fewer bytes for smaller values, affecting the transaction size.

**Workaround**: Use a larger dummy fee (e.g., 300000) when building your draft. This ensures the transaction size in the draft is similar to or larger than the final transaction, preventing fee underestimation:

```bash
# Build draft with larger dummy fee to account for size changes
cardano-cli latest transaction build-raw \
  --tx-in 4694eddc13d7fab25722acc0a35bfdca4435a3b99830fb1723cb2e94478d366b#0 \
  --tx-out "$(cat payment2.addr)+1000000000" \
  --tx-out "$(cat payment1.addr)+8999700000" \
  --fee 300000 \
  --protocol-params-file pparams.json \
  --out-file tx.draft
```

The 300000 value isn't special – any reasonably large fee works to ensure proper size calculation.
:::

Calculate the fee:

```bash
cardano-cli latest transaction calculate-min-fee \
  --tx-body-file tx.draft \
  --protocol-params-file pparams.json \
  --witness-count 1
```

Output: `167041 Lovelace`

### Step 5: Build Final Transaction

Calculate change: `10000000000 - 1000000000 - 167041 = 8999832959`

```bash
cardano-cli latest transaction build-raw \
  --tx-in 4694eddc13d7fab25722acc0a35bfdca4435a3b99830fb1723cb2e94478d366b#0 \
  --tx-out "$(cat payment2.addr)+1000000000" \
  --tx-out "$(cat payment1.addr)+8999832959" \
  --fee 167041 \
  --protocol-params-file pparams.json \
  --out-file tx.raw
```

### Step 6: Sign Transaction

```bash
cardano-cli latest transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment1.skey \
  --out-file tx.signed
```

### Step 7: Submit Transaction

```bash
cardano-cli latest transaction submit --tx-file tx.signed
```

Success output:
```
Transaction successfully submitted.
```

---

## Method 2: Using build (Automatic)

The `build` command simplifies the process by handling fee calculation automatically.

### Step 1: Build Transaction

```bash
cardano-cli latest transaction build \
  --tx-in 4694eddc13d7fab25722acc0a35bfdca4435a3b99830fb1723cb2e94478d366b#0 \
  --tx-out "$(cat payment2.addr)+1000000000" \
  --change-address $(cat payment1.addr) \
  --out-file tx.raw
```

Output:
```
Estimated transaction fee: Lovelace 167041
```

### Step 2: Sign and Submit

```bash
# Sign
cardano-cli latest transaction sign \
  --tx-body-file tx.raw \
  --signing-key-file payment1.skey \
  --out-file tx.signed

# Submit
cardano-cli latest transaction submit --tx-file tx.signed
```

---

## Inspecting Transactions

### View Transaction Structure

Detailed human-readable format:

```bash
cardano-cli debug transaction view --tx-body-file tx.raw
```

Key fields to check:
- **inputs** – UTxOs being consumed
- **outputs** – New UTxOs being created  
- **fee** – Transaction cost in lovelace
- **witnesses** – Empty until signed

### Get Transaction ID

Before submission (from signed file):

```bash
cardano-cli latest transaction txid --tx-file tx.signed
```

After submission:

```bash
cardano-cli latest query utxo --tx-in <txid>#<index>
```

---

## Common Patterns

### Multiple Outputs

Send to multiple recipients:

```bash
cardano-cli latest transaction build \
  --tx-in 4694eddc13d7fab25722acc0a35bfdca4435a3b99830fb1723cb2e94478d366b#0 \
  --tx-out "$(cat alice.addr)+500000000" \
  --tx-out "$(cat bob.addr)+300000000" \
  --tx-out "$(cat charlie.addr)+200000000" \
  --change-address $(cat payment1.addr) \
  --out-file tx.raw
```

### Using Multiple Inputs

```bash
cardano-cli latest transaction build \
  --tx-in 4694eddc13d7fab25722acc0a35bfdca4435a3b99830fb1723cb2e94478d366b#0 \
  --tx-in 42815054e2be3257326a1ba85e83cde9c41061883a06f824899db0d4ed8f3a66#1 \
  --tx-out "$(cat payment2.addr)+15000000000" \
  --change-address $(cat payment1.addr) \
  --out-file tx.raw
```

### Programmatic UTxO Selection

```bash
# Get first UTxO as input
FIRST_UTXO=$(cardano-cli latest query utxo \
  --address $(cat payment.addr) \
  --output-json | jq -r 'keys[0]')

cardano-cli latest transaction build \
  --tx-in $FIRST_UTXO \
  --tx-out "$(cat payment2.addr)+1000000000" \
  --change-address $(cat payment.addr) \
  --out-file tx.raw
```

---

## Troubleshooting

### Node Connection Issues

```bash
# Check node status
cardano-cli latest query tip

# If not set, configure environment variables:
export CARDANO_NODE_SOCKET_PATH=/path/to/node.socket
export CARDANO_NODE_NETWORK_ID=2  # Preview testnet
```

### Insufficient Funds

Always account for:
- Transaction amount
- Transaction fee (~0.17–0.2 ADA for simple transactions)
- Minimum UTxO value (~1 ADA per output)

### Fee Too Small Errors

If using `build-raw` and getting fee errors:
1. Use the 300000 fee workaround when calculating
2. Add a small buffer (5-10%) to calculated fees
3. Consider using `build` command instead

---

## Complete Example

Here's a real transaction from start to finish:

```bash
# 1. Check balance
$ cardano-cli latest query utxo --address $(cat payment1.addr)
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
4694eddc13d7fab25722acc0a35bfdca4435a3b99830fb1723cb2e94478d366b     0        10000000000 lovelace

# 2. Build transaction (sending 1000 ADA)
$ cardano-cli latest transaction build \
    --tx-in 4694eddc13d7fab25722acc0a35bfdca4435a3b99830fb1723cb2e94478d366b#0 \
    --tx-out "$(cat payment2.addr)+1000000000" \
    --change-address $(cat payment1.addr) \
    --out-file tx.raw

Estimated transaction fee: Lovelace 167041

# 3. Sign
$ cardano-cli latest transaction sign \
    --tx-body-file tx.raw \
    --signing-key-file payment1.skey \
    --out-file tx.signed

# 4. Submit
$ cardano-cli latest transaction submit --tx-file tx.signed
Transaction successfully submitted.

# 5. Verify - Check both addresses
$ cardano-cli latest query utxo --address $(cat payment1.addr)
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
42815054e2be3257326a1ba85e83cde9c41061883a06f824899db0d4ed8f3a66     1        8999832959 lovelace

$ cardano-cli latest query utxo --address $(cat payment2.addr)  
                           TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
42815054e2be3257326a1ba85e83cde9c41061883a06f824899db0d4ed8f3a66     0        1000000000 lovelace
```

Transaction breakdown:

| Component    | Amount          | Description |
| ------------ | --------------- | ----------- |
| **Input**    | 10,000 ADA      | Total UTxO  |
| **Output 1** | 1,000 ADA       | Payment     |
| **Output 2** | 8,999.832959 ADA| Change      |
| **Fee**      | 0.167041 ADA    | Network fee |

---