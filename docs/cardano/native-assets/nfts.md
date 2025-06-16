---
title: Non-Fungible Tokens (NFTs)
sidebar_position: 4
---

# NFTs on Cardano

Non-Fungible Tokens (NFTs) on Cardano are unique digital assets that represent ownership of specific items, whether digital art, collectibles, real-world assets, or access rights. Unlike fungible tokens, each NFT is distinct and cannot be exchanged on a one-to-one basis with another NFT.

## What Makes Cardano NFTs Special?

### Native Asset Architecture
- NFTs are first-class citizens on Cardano
- No smart contracts required for basic NFT functionality
- Lower minting costs compared to smart contract platforms
- Inherent security of the Cardano blockchain

### Metadata Standards
Cardano has well-defined standards for NFT metadata:
- **CIP-25**: Basic NFT metadata standard
- **CIP-68**: Reference NFT standard with on-chain metadata
- **CIP-27**: Royalty standard for secondary sales

## NFT Structure

### Essential Components

1. **Policy ID**: Unique identifier for the minting policy
2. **Asset Name**: Unique name within the policy (often numbered)
3. **Metadata**: Describes the NFT properties and content
4. **Token Amount**: Usually 1 for true NFTs

### Metadata Structure (CIP-25)

```json
{
  "721": {
    "<policy_id>": {
      "<asset_name>": {
        "name": "My NFT #001",
        "image": "ipfs://QmNFTImageHash",
        "description": "A unique digital collectible",
        "attributes": {
          "Background": "Blue",
          "Character": "Warrior",
          "Rarity": "Rare"
        },
        "mediaType": "image/png",
        "files": [
          {
            "name": "My NFT #001",
            "mediaType": "image/png",
            "src": "ipfs://QmNFTImageHash"
          }
        ]
      }
    },
    "version": "1.0"
  }
}
```

## Creating NFTs

### 1. Prepare Your Assets

#### Image Storage Options
- **IPFS**: Decentralized, permanent storage
- **Arweave**: Permanent storage with one-time fee
- **Cloud Storage**: Centralized but reliable
- **On-chain**: Small images can be base64 encoded

#### File Preparation
```bash
# Add to IPFS
ipfs add artwork.png
# Returns: added QmXxxxx artwork.png

# Pin on service (e.g., Pinata, Infura)
curl -X POST https://api.pinata.cloud/pinning/pinFileToIPFS \
  -H "Authorization: Bearer YOUR_JWT" \
  -F file=@artwork.png
```

### 2. Create Minting Policy

#### Single NFT Policy
```json
{
  "type": "all",
  "scripts": [
    {
      "type": "sig",
      "keyHash": "your_key_hash"
    },
    {
      "type": "before",
      "slot": 87654321
    }
  ]
}
```

#### Collection Policy
For minting multiple NFTs in a collection:
```json
{
  "type": "sig",
  "keyHash": "collection_owner_key_hash"
}
```

### 3. Mint the NFT

```bash
# Set variables
POLICY_ID=$(cat policyID)
NFT_NAME="MyNFT001"
METADATA_FILE="nft-metadata.json"

# Build minting transaction
cardano-cli transaction build \
    --tx-in $UTXO \
    --tx-out "$RECIPIENT+2000000+1 $POLICY_ID.$NFT_NAME" \
    --mint "1 $POLICY_ID.$NFT_NAME" \
    --minting-script-file policy.script \
    --metadata-json-file $METADATA_FILE \
    --change-address $CHANGE_ADDR \
    --out-file mint-nft.raw \
    $NETWORK
```

## NFT Collections

### Collection Structure

```
Collection Policy
├── NFT #001
├── NFT #002
├── NFT #003
└── ... #N
```

### Batch Minting Script

```python
# Python example for batch minting
import json
import subprocess

def mint_nft_batch(policy_id, base_name, count, metadata_template):
    for i in range(1, count + 1):
        nft_name = f"{base_name}{str(i).zfill(4)}"
        metadata = generate_metadata(i, metadata_template)
        
        # Build and submit transaction
        mint_single_nft(policy_id, nft_name, metadata)
```

### Collection Metadata Standards

```json
{
  "721": {
    "<policy_id>": {
      "<collection_name>": {
        "name": "My Collection",
        "description": "A collection of unique NFTs",
        "publisher": "Creator Name",
        "website": "https://mycollection.com"
      },
      "<nft_asset_name>": {
        "name": "Collection Item #1",
        "collection": "<collection_name>"
      }
    }
  }
}
```

## Advanced NFT Features

### 1. Royalties (CIP-27)

Implement royalty payments for secondary sales:

```json
{
  "777": {
    "<policy_id>": {
      "rate": "0.05",
      "addr": "addr1_creator_address"
    }
  }
}
```

### 2. Reference NFTs (CIP-68)

Store metadata on-chain using datum:

```javascript
// Reference NFT pattern
const referenceNFT = {
  prefix: "000643b0",  // Reference token prefix
  userToken: "000de140" // User token prefix
};

// Mint both reference and user tokens
const assets = {
  [policyId + referenceNFT.prefix + tokenName]: 1n,
  [policyId + referenceNFT.userToken + tokenName]: 1n
};
```

### 3. Smart Contract NFTs

Using Plutus for advanced functionality:

```haskell
-- NFT validator with ownership rules
nftValidator :: AssetClass -> Address -> () -> ScriptContext -> Bool
nftValidator nft owner _ ctx = 
    hasNFT && correctOwner
  where
    info = scriptContextTxInfo ctx
    hasNFT = assetClassValueOf (valuePaidTo info owner) nft == 1
    correctOwner = txSignedBy info (addressPubKeyHash owner)
```

## NFT Marketplaces

### Popular Cardano NFT Marketplaces

1. **jpg.store**: Largest Cardano NFT marketplace
2. **CNFT.io**: Community-driven marketplace
3. **Artano**: Curated art NFTs
4. **SpaceBudz Market**: Built-in marketplace

### Listing Your NFTs

Most marketplaces support:
- Direct listing after minting
- Royalty enforcement
- Collection verification
- Rarity rankings

## NFT Development Tools

### Minting Services

1. **NMKR (formerly NFT-MAKER)**
   - No-code NFT creation
   - API for programmatic minting
   - IPFS integration

2. **Tangocrypto**
   ```javascript
   // Mint NFT via API
   const response = await tangoAPI.mintNFT({
     policy_id: policyId,
     asset_name: "MyNFT001",
     metadata: nftMetadata,
     recipient: recipientAddress
   });
   ```

3. **BlockFrost API**
   ```bash
   # Query NFT metadata
   curl -H "project_id: $PROJECT_ID" \
     https://cardano-mainnet.blockfrost.io/api/v0/assets/$ASSET_ID
   ```

### Development Libraries

#### Chrysalis (.NET)
```csharp
// Create NFT with Chrysalis
var nft = new NFTBuilder()
    .WithName("My NFT #001")
    .WithImage("ipfs://QmImageHash")
    .WithAttribute("Rarity", "Legendary")
    .Build();

var mintTx = new TransactionBuilder()
    .MintAsset(policyId, nft.AssetName, 1)
    .WithMetadata(nft.Metadata)
    .Build();
```

#### Lucid (TypeScript)
```typescript
const metadata = {
  name: "My NFT",
  image: "ipfs://QmXxxx",
  attributes: {
    strength: 10,
    speed: 5
  }
};

const tx = await lucid.newTx()
  .mintAssets({[unit]: 1n})
  .attachMetadata(721, {[policyId]: {[name]: metadata}})
  .complete();
```

## Best Practices

### 1. Metadata Guidelines
- Use IPFS or Arweave for permanence
- Include high-resolution images
- Follow CIP-25 standard strictly
- Add comprehensive attributes

### 2. Policy Design
- Time-lock policies for limited editions
- Consider burning mechanisms
- Plan for future collections
- Secure key management

### 3. Community Building
- Engage with collectors
- Provide utility beyond ownership
- Create compelling narratives
- Regular updates and communication

### 4. Legal Considerations
- Clear ownership rights
- License terms for artwork
- Royalty agreements
- Compliance with regulations

## Common Patterns

### Limited Edition Drops
```javascript
// Time-limited minting window
{
  "type": "all",
  "scripts": [
    {"type": "after", "slot": startSlot},
    {"type": "before", "slot": endSlot},
    {"type": "sig", "keyHash": minterKey}
  ]
}
```

### Whitelist Minting
```javascript
// Multiple authorized minters
{
  "type": "any",
  "scripts": [
    {"type": "sig", "keyHash": whitelist1},
    {"type": "sig", "keyHash": whitelist2},
    {"type": "sig", "keyHash": whitelist3}
  ]
}
```

### Reveal Mechanics
1. Mint with placeholder metadata
2. Update token registry after reveal
3. Or use reference NFTs for on-chain updates

## Troubleshooting

### Common Issues

1. **Metadata Not Showing**
   - Verify CIP-25 format
   - Check IPFS gateway availability
   - Ensure proper JSON structure

2. **High Minting Fees**
   - Optimize metadata size
   - Batch transactions when possible
   - Use efficient UTXO management

3. **Policy Errors**
   - Verify slot numbers for time locks
   - Check key hash calculations
   - Ensure proper script format

## Future of Cardano NFTs

### Upcoming Features
- Enhanced smart contract integration
- Cross-chain NFT bridges
- Dynamic NFT standards
- Improved marketplace protocols

### Ecosystem Growth
- Gaming NFTs
- Metaverse integration
- DeFi + NFT combinations
- Real-world asset tokenization

## Resources

- [CIP-25 Standard](https://cips.cardano.org/cips/cip25/)
- [CIP-68 Reference NFTs](https://cips.cardano.org/cips/cip68/)
- [Cardano NFT Best Practices](https://developers.cardano.org/docs/native-tokens/minting-nfts)
- [IPFS Documentation](https://docs.ipfs.io/)