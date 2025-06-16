---
title: Fungible Tokens
sidebar_position: 2
---

# Fungible Tokens on Cardano

Fungible tokens are interchangeable digital assets where each unit is identical to another. On Cardano, these tokens can represent various forms of value including cryptocurrencies, stablecoins, governance tokens, and utility tokens.

## Understanding Fungible Tokens

### Characteristics

- **Interchangeable**: Each token unit has the same value and properties
- **Divisible**: Can be divided into smaller units (up to 6 decimal places on Cardano)
- **Uniform**: All tokens of the same type are identical
- **Transferable**: Can be freely sent between addresses

### Common Use Cases

1. **Utility Tokens**: Access to services or platform features
2. **Governance Tokens**: Voting rights in DAOs and protocols
3. **Stablecoins**: Tokens pegged to fiat currencies
4. **Reward Tokens**: Incentive mechanisms for participation
5. **Security Tokens**: Tokenized traditional securities

## Token Properties

### Asset Name
The human-readable name of your token (e.g., "MyToken")

### Policy ID
A unique identifier derived from the minting policy script hash

### Asset ID
The combination of Policy ID and Asset Name that uniquely identifies a token

### Decimals
Cardano doesn't have native decimal support, so tokens use the smallest unit (like Lovelace for ADA)

## Creating Fungible Tokens

### Prerequisites

1. Cardano node access
2. cardano-cli installed
3. Sufficient ADA for fees
4. Understanding of minting policies

### Basic Token Creation Process

```bash
# 1. Generate policy keys
cardano-cli address key-gen \
    --verification-key-file policy.vkey \
    --signing-key-file policy.skey

# 2. Create a simple time-locked policy
echo "{" > policy.script
echo "  \"type\": \"all\"," >> policy.script
echo "  \"scripts\":" >> policy.script
echo "  [" >> policy.script
echo "    {" >> policy.script
echo "      \"type\": \"before\"," >> policy.script
echo "      \"slot\": <SLOT_NUMBER>" >> policy.script
echo "    }," >> policy.script
echo "    {" >> policy.script
echo "      \"type\": \"sig\"," >> policy.script
echo "      \"keyHash\": \"$(cardano-cli address key-hash --payment-verification-key-file policy.vkey)\"" >> policy.script
echo "    }" >> policy.script
echo "  ]" >> policy.script
echo "}" >> policy.script

# 3. Calculate policy ID
cardano-cli transaction policyid --script-file policy.script > policyID
```

### Token Metadata

Tokens should include metadata following CIP-38 standard:

```json
{
  "721": {
    "<policy_id>": {
      "<asset_name>": {
        "name": "My Token",
        "description": "A sample fungible token",
        "ticker": "MTK",
        "decimals": 6,
        "url": "https://mytoken.com",
        "logo": "ipfs://QmTokenLogo"
      }
    }
  }
}
```

## Token Economics

### Supply Models

1. **Fixed Supply**: All tokens minted at once
2. **Inflationary**: New tokens can be minted over time
3. **Deflationary**: Tokens can be burned to reduce supply
4. **Dynamic**: Supply adjusts based on demand

### Distribution Strategies

- **Initial Coin Offering (ICO)**: Direct sale to investors
- **Airdrops**: Free distribution to holders
- **Liquidity Mining**: Rewards for providing liquidity
- **Vesting Schedules**: Gradual release over time

## Managing Tokens

### Minting Additional Supply

For tokens with open minting policies:

```bash
# Build minting transaction
cardano-cli transaction build \
    --tx-in <UTXO> \
    --tx-out <ADDRESS>+<LOVELACE>+"<AMOUNT> <POLICYID>.<TOKENNAME>" \
    --mint "<AMOUNT> <POLICYID>.<TOKENNAME>" \
    --minting-script-file policy.script \
    --change-address <CHANGE_ADDRESS> \
    --out-file mint.raw

# Sign and submit
cardano-cli transaction sign \
    --tx-body-file mint.raw \
    --signing-key-file payment.skey \
    --signing-key-file policy.skey \
    --out-file mint.signed

cardano-cli transaction submit \
    --tx-file mint.signed
```

### Burning Tokens

To permanently remove tokens from circulation:

```bash
# Burn by sending negative mint amount
cardano-cli transaction build \
    --tx-in <UTXO_WITH_TOKENS> \
    --tx-out <ADDRESS>+<LOVELACE> \
    --mint "-<AMOUNT> <POLICYID>.<TOKENNAME>" \
    --minting-script-file policy.script \
    --change-address <CHANGE_ADDRESS> \
    --out-file burn.raw
```

## Token Standards

### CIP-38: Token Metadata
Defines how to include token information in metadata

### Min-Ada Requirements
Each UTXO containing tokens must have a minimum ADA amount:

```
minAda = 1000000 + (numAssets * 1344798) + (sumAssetNameLengths * 38)
```

## Integration with DeFi

### DEX Listings
Fungible tokens can be listed on Cardano DEXs like:
- SundaeSwap
- Minswap
- WingRiders
- MuesliSwap

### Liquidity Pools
Tokens can be paired with ADA or other tokens in liquidity pools

### Yield Farming
Tokens can be used for:
- Staking rewards
- Liquidity provision rewards
- Governance participation

## Best Practices

1. **Clear Tokenomics**: Define supply, distribution, and utility clearly
2. **Transparent Policies**: Make minting policies publicly verifiable
3. **Metadata Standards**: Follow CIP standards for better wallet support
4. **Security Audits**: Have policies reviewed by experts
5. **Community Communication**: Keep holders informed of changes

## Common Patterns

### Time-Locked Minting
Restrict minting to specific time periods:

```javascript
{
  "type": "all",
  "scripts": [
    {
      "type": "after",
      "slot": startSlot
    },
    {
      "type": "before", 
      "slot": endSlot
    },
    {
      "type": "sig",
      "keyHash": "..."
    }
  ]
}
```

### Multi-Signature Minting
Require multiple signatures for minting:

```javascript
{
  "type": "atLeast",
  "n": 2,
  "scripts": [
    {"type": "sig", "keyHash": "key1"},
    {"type": "sig", "keyHash": "key2"},
    {"type": "sig", "keyHash": "key3"}
  ]
}
```

## Tools and Libraries

### CLI Tools
- cardano-cli: Official command-line interface
- cardano-wallet: Wallet backend with token support

### SDKs
- **Chrysalis (.NET)**: Full native asset support
- Lucid (TypeScript)
- PyCardano (Python)
- Cardano-js-sdk (JavaScript)

## Next Steps

- Learn about the [Minting Process](./minting.md) in detail
- Explore [NFT Creation](./nfts.md) for unique tokens
- Review [Token Standards](https://github.com/cardano-foundation/CIPs) (CIPs)