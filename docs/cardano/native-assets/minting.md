---
title: Minting Process
sidebar_position: 3
---

# Minting Native Assets on Cardano

Minting is the process of creating new tokens on the Cardano blockchain. This guide covers the complete minting process, from policy creation to token distribution.

## Understanding Minting Policies

A minting policy is a set of rules that determines who can mint or burn tokens and under what conditions. Once a token is minted under a policy, that policy governs all future minting and burning operations for that token.

### Policy Types

1. **Simple Signature**: Requires a specific key signature
2. **Time-Locked**: Can only mint before/after certain times
3. **Multi-Signature**: Requires multiple signatures
4. **Script-Based**: Complex logic using Plutus scripts

### Policy Components

```javascript
{
  "type": "all",              // Condition type
  "scripts": [                // Array of conditions
    {
      "type": "sig",         // Signature requirement
      "keyHash": "abc123..." // Public key hash
    }
  ]
}
```

## Step-by-Step Minting Guide

### 1. Setup Environment

```bash
# Check cardano-cli is installed
cardano-cli --version

# Set network (mainnet or testnet)
export CARDANO_NODE_SOCKET_PATH=/path/to/node.socket
export NETWORK="--mainnet"  # or "--testnet-magic 1"
```

### 2. Create Policy Keys

```bash
# Generate verification and signing keys
cardano-cli address key-gen \
    --verification-key-file policy.vkey \
    --signing-key-file policy.skey

# Get key hash
cardano-cli address key-hash \
    --payment-verification-key-file policy.vkey > policy.hash
```

### 3. Design Your Policy

#### Simple Policy (Single Signature)
```json
{
  "type": "sig",
  "keyHash": "58b8c37693a5b68e37c97794b35c072f183e9c32b2115b7e61e71387"
}
```

#### Time-Locked Policy
```json
{
  "type": "all",
  "scripts": [
    {
      "type": "before",
      "slot": 87654321
    },
    {
      "type": "sig",
      "keyHash": "58b8c37693a5b68e37c97794b35c072f183e9c32b2115b7e61e71387"
    }
  ]
}
```

#### Multi-Signature Policy
```json
{
  "type": "atLeast",
  "n": 2,
  "scripts": [
    {"type": "sig", "keyHash": "key1_hash"},
    {"type": "sig", "keyHash": "key2_hash"},
    {"type": "sig", "keyHash": "key3_hash"}
  ]
}
```

### 4. Calculate Policy ID

```bash
# Save policy to file
cat > policy.script << EOF
{
  "type": "sig",
  "keyHash": "$(cat policy.hash)"
}
EOF

# Get policy ID
cardano-cli transaction policyid --script-file policy.script > policyID
```

### 5. Prepare Token Metadata

Create metadata following CIP-25 (NFTs) or CIP-38 (fungible tokens):

```json
{
  "721": {
    "<policy_id>": {
      "<asset_name>": {
        "name": "My Token",
        "image": "ipfs://QmTokenImage",
        "description": "Description of my token",
        "decimals": 6,
        "ticker": "MTK"
      }
    }
  }
}
```

### 6. Build Minting Transaction

```bash
# Get payment address info
cardano-cli query utxo --address $ADDRESS $NETWORK

# Set variables
TXIN="<UTXO>#<INDEX>"
MINT_AMOUNT=1000000
TOKEN_NAME="MyToken"
POLICY_ID=$(cat policyID)

# Build transaction
cardano-cli transaction build \
    --tx-in $TXIN \
    --tx-out "$ADDRESS+2000000+$MINT_AMOUNT $POLICY_ID.$TOKEN_NAME" \
    --mint "$MINT_AMOUNT $POLICY_ID.$TOKEN_NAME" \
    --minting-script-file policy.script \
    --metadata-json-file metadata.json \
    --change-address $ADDRESS \
    --out-file mint.raw \
    $NETWORK
```

### 7. Sign Transaction

```bash
# For simple signature policy
cardano-cli transaction sign \
    --tx-body-file mint.raw \
    --signing-key-file payment.skey \
    --signing-key-file policy.skey \
    --out-file mint.signed \
    $NETWORK

# For multi-sig (each party signs)
cardano-cli transaction witness \
    --tx-body-file mint.raw \
    --signing-key-file policy1.skey \
    --out-file mint.witness1 \
    $NETWORK
```

### 8. Submit Transaction

```bash
cardano-cli transaction submit \
    --tx-file mint.signed \
    $NETWORK
```

## Advanced Minting Patterns

### Batch Minting

Mint multiple tokens in one transaction:

```bash
# Multiple tokens, same policy
--mint "1000 $POLICY_ID.Token1 + 2000 $POLICY_ID.Token2"

# Multiple outputs
--tx-out "$ADDR1+2000000+500 $POLICY_ID.Token1" \
--tx-out "$ADDR2+2000000+500 $POLICY_ID.Token1"
```

### Parameterized Minting

Using Plutus scripts for dynamic minting:

```haskell
{-# INLINABLE mkPolicy #-}
mkPolicy :: TokenName -> Integer -> ScriptContext -> Bool
mkPolicy tn amt ctx = 
    traceIfFalse "wrong amount" correctAmount &&
    traceIfFalse "not signed" signedByOwner
  where
    info = scriptContextTxInfo ctx
    correctAmount = valueOf (txInfoMint info) (ownCurrencySymbol ctx) tn == amt
    signedByOwner = txSignedBy info ownerPKH
```

### Minting with Smart Contracts

```javascript
// Using Lucid
const mintingPolicy = {
  type: "PlutusV2",
  script: compiledScript
};

const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);

const tx = await lucid
  .newTx()
  .mintAssets({
    [policyId + fromText("MyNFT")]: 1n
  })
  .attachMintingPolicy(mintingPolicy)
  .complete();
```

## Minting Policy Best Practices

### 1. Policy Design Considerations

- **Immutability**: Policies cannot be changed after creation
- **Time Limits**: Consider if minting should be time-bound
- **Key Management**: Secure storage of policy keys
- **Burning Rights**: Design who can burn tokens

### 2. Security Guidelines

- Never share policy signing keys
- Use hardware wallets for high-value policies
- Consider multi-sig for team projects
- Test on testnet first

### 3. Common Pitfalls

- **Lost Keys**: No recovery if policy keys are lost
- **Wrong Time Slots**: Ensure correct slot calculations
- **Metadata Errors**: Validate JSON before minting
- **Insufficient ADA**: Include min-ADA requirements

## Minting Tools and Services

### Command Line Tools

- **cardano-cli**: Official CLI tool
- **cncli**: Community node CLI
- **token-registry-api**: For token registration

### GUI Tools

- **Tangocrypto**: API and minting interface
- **NMKR**: No-code NFT minting
- **BlockFrost**: API with minting endpoints

### Development Libraries

- **Chrysalis (.NET)**
  ```csharp
  var mint = new MintTokens()
  {
      PolicyId = policyId,
      Assets = new Dictionary<string, long>
      {
          { "MyToken", 1000000 }
      }
  };
  ```

- **Lucid (TypeScript)**
  ```typescript
  const tx = await lucid.newTx()
    .mintAssets(assets)
    .attachMintingPolicy(policy)
    .complete();
  ```

## Token Registration

After minting, register your token for better wallet support:

1. **Prepare registration JSON**
2. **Submit to Cardano Token Registry**
3. **Wait for approval (usually 24-48 hours)**
4. **Token appears with metadata in wallets**

## Burning Tokens

To permanently remove tokens:

```bash
# Negative mint amount burns tokens
cardano-cli transaction build \
    --tx-in "$UTXO_WITH_TOKENS" \
    --tx-out "$ADDRESS+2000000" \
    --mint "-$BURN_AMOUNT $POLICY_ID.$TOKEN_NAME" \
    --minting-script-file policy.script \
    --change-address $ADDRESS \
    --out-file burn.raw \
    $NETWORK
```

## Troubleshooting

### Common Errors

1. **"ScriptWitnessNotValidating"**
   - Check policy script matches transaction
   - Verify all required signatures

2. **"TokenBundleSizeExceeded"**
   - Too many tokens in one UTXO
   - Split into multiple outputs

3. **"InsufficientFunds"**
   - Include enough ADA for fees and min-ADA

4. **"BadInputs"**
   - UTXO already spent
   - Query latest UTXO state

## Next Steps

- Explore [NFT-specific features](./nfts.md)
- Learn about [token standards](https://cips.cardano.org)
- Review [Plutus minting policies](https://plutus.readthedocs.io)