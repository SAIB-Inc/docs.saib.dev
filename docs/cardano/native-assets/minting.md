---
title: Minting Process
sidebar_position: 3
---

# Minting Native Assets on Cardano

Minting is the process of creating new tokens on the Cardano blockchain. This guide covers the complete minting process, from policy creation to token distribution. Unlike other blockchains that require smart contracts for token creation, Cardano's native asset functionality allows minting through simple transaction commands and policy scripts. Understanding the minting process empowers developers to create custom tokens for various use cases while maintaining full control over supply and distribution.

---

## Understanding Minting Policies

A minting policy is a set of rules that determines who can mint or burn tokens and under what conditions. Once a token is minted under a policy, that policy governs all future minting and burning operations for that token.

### Policy Types

1. **Simple Signature**: Requires a specific key signature. This is the most straightforward policy type where only the holder of a particular private key can mint or burn tokens. It's ideal for single-owner tokens or projects where one entity maintains full control over the token supply. The simplicity makes it perfect for testing and small-scale projects.

2. **Time-Locked**: Can only mint before/after certain times. These policies enforce temporal constraints on minting operations, allowing tokens to be created only within specific time windows. Common use cases include limited-time token sales, vesting schedules, or ensuring a token supply becomes fixed after a certain date. Time locks use Cardano's slot numbers for precise timing control.

3. **Multi-Signature**: Requires multiple signatures. This policy type enhances security by requiring agreement from multiple parties before minting can occur. It's perfect for team-managed projects, DAOs, or any scenario where distributed control is desired. The policy can specify the exact number of required signatures (M of N), providing flexibility in governance models.

4. **Script-Based**: Complex logic using Plutus scripts. These policies leverage Cardano's smart contract capabilities to implement sophisticated minting rules beyond simple signatures or time constraints. Plutus scripts can incorporate external data, complex conditions, and state management. This enables advanced features like oracle-based minting, conditional token creation based on on-chain events, or integration with other smart contracts.

### Policy Components

Understanding the structure of minting policies is crucial for creating secure and functional tokens. Policies are defined using JSON format with specific fields that determine the authorization logic. Here's a breakdown of the key components:

```javascript
{
  "type": "all",              // Condition type - requires ALL conditions in scripts array to be satisfied
  "scripts": [                // Array of conditions that must be met for minting/burning
    {
      "type": "sig",         // Signature requirement - verifies a specific key signed the transaction
      "keyHash": "abc123..." // Public key hash - identifies which key must provide the signature
    }
  ]
}
```

The policy structure supports various condition types:
- **"all"**: Requires every condition in the scripts array to be satisfied
- **"any"**: Requires at least one condition to be satisfied
- **"atLeast"**: Requires a minimum number (N) of conditions to be met
- **"sig"**: Validates a cryptographic signature from a specific key
- **"before"/"after"**: Time-based conditions using slot numbers

These components can be combined to create sophisticated authorization schemes that match your project's security and operational requirements.

---

## Step-by-Step Minting Guide

### 1. Setup Environment

Before minting tokens, ensure your development environment is properly configured with the necessary tools and network settings. This step verifies that cardano-cli is installed and sets up the connection to either mainnet or testnet.

```bash
# Check cardano-cli is installed
cardano-cli --version

# Set network (mainnet or testnet)
export CARDANO_NODE_SOCKET_PATH=/path/to/node.socket
export NETWORK="--mainnet"  # or "--testnet-magic 1"
```

### 2. Create Policy Keys

Generate the cryptographic keys that will control your minting policy. These keys determine who has the authority to mint or burn tokens under this policy. Keep the signing key (policy.skey) secure, as anyone with access to it can mint tokens.

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

Choose the appropriate policy structure based on your project's requirements. The policy type determines the rules for minting and burning tokens. Consider factors like security needs, team structure, and token distribution timeline when selecting a policy type.

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

The Policy ID is a unique identifier derived from your policy script's hash. This ID becomes part of your token's identity and cannot be changed. All tokens minted under this policy will share the same Policy ID.

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

Metadata provides essential information about your tokens that wallets and exchanges use for display purposes. Well-structured metadata enhances user experience and ensures your tokens are properly recognized across the ecosystem.

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

Construct the transaction that will create your tokens on the blockchain. This step combines all previous elements - the policy, metadata, and transaction inputs/outputs - into a single transaction. Ensure you have sufficient ADA to cover transaction fees and minimum UTXO requirements.

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

Authorize the minting transaction with the required signatures. The signing process varies based on your policy type - simple policies need just the policy key, while multi-signature policies require signatures from multiple parties. This step proves you have the authority to mint under the specified policy.

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

Broadcast your signed transaction to the Cardano network. Once submitted and confirmed, your tokens will be created and distributed according to the transaction outputs. Monitor the transaction status to ensure successful minting.

```bash
cardano-cli transaction submit \
    --tx-file mint.signed \
    $NETWORK
```

---

## Minting Tools and Services

Beyond the standard cardano-cli covered in the minting guide, the Cardano ecosystem offers specialized tools and libraries that simplify token creation through higher-level abstractions. These solutions range from no-code GUI interfaces for non-technical users to powerful SDKs like Chrysalis for .NET developers, enabling rapid development of minting applications. Whether you prefer visual interfaces, REST APIs, or programmatic control through your favorite programming language, these tools accelerate the minting process while maintaining the security and reliability of native assets.

### Development Libraries

- **[Chrysalis (.NET)](/docs/chrysalis/overview)**: SAIB's comprehensive framework providing type-safe, intuitive APIs for minting operations
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

- **Lucid (TypeScript)**: A lightweight, modern library for building Cardano dApps with an intuitive API that simplifies minting operations
  ```typescript
  const tx = await lucid.newTx()
    .mintAssets(assets)
    .attachMintingPolicy(policy)
    .complete();
  ```

---

## Token Registration

Token registration enhances the user experience by ensuring your tokens display properly with their metadata across wallets and blockchain explorers. While tokens function without registration, registered tokens show their names, symbols, and logos instead of just policy IDs and hexadecimal names. The Cardano Token Registry maintains this decentralized database of token information that ecosystem tools reference.

### Registration Process

1. **Prepare registration JSON**:
   Create a properly formatted JSON file containing your token's metadata, including name, description, policy ID, ticker symbol, decimals, and logo URL. The metadata must match exactly what was used during minting to ensure consistency.

2. **Submit to Cardano Token Registry**:
   Fork the official token registry repository on GitHub, add your token's JSON file following the prescribed directory structure, and create a pull request. The submission must include proof of token ownership, typically by including a specific transaction signed with the policy key.

3. **Wait for approval (usually 24-48 hours)**:
   Registry maintainers review submissions for completeness, accuracy, and compliance with standards. They verify token ownership and ensure metadata quality before merging the pull request into the main registry.

4. **Token appears with metadata in wallets**:
   Once approved and merged, wallets and services that sync with the registry will begin displaying your token with its proper name, symbol, and logo. This process typically takes effect within hours of approval as services update their local caches.

---

## Burning Tokens

Token burning permanently removes tokens from circulation by sending them back to the minting policy with a negative mint value. This irreversible action reduces the total supply and requires the same authorization as minting - only parties with the appropriate policy keys can burn tokens.

To burn tokens, use a negative mint amount in your transaction:

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

---

## Next Steps

- Create [Fungible Tokens](./tokens.md) using the minting knowledge gained here
- Explore [NFT Creation](./nfts.md) for unique digital assets
- Build minting applications with [Chrysalis](/docs/chrysalis/overview) for automated token creation