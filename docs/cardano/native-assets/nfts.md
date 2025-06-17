---
title: Non-Fungible Tokens (NFTs)
sidebar_position: 4
---

# NFTs on Cardano

Non-Fungible Tokens (NFTs) on Cardano are unique digital assets that represent ownership of specific items, whether digital art, collectibles, real-world assets, or access rights. Unlike fungible tokens, each NFT is distinct and cannot be exchanged on a one-to-one basis with another NFT.

## What Makes Cardano NFTs Special?

Cardano's approach to NFTs leverages its native asset functionality, offering significant advantages over traditional smart contract-based implementations. This design philosophy prioritizes efficiency, security, and simplicity, making NFT creation accessible while maintaining enterprise-grade reliability. The combination of native asset architecture and comprehensive metadata standards creates a robust ecosystem for digital collectibles and tokenized assets.

### Native Asset Architecture

The native asset functionality fundamentally changes how NFTs operate on Cardano compared to other blockchains:

- **NFTs are first-class citizens on Cardano**: Unlike platforms where NFTs exist within smart contracts, Cardano treats NFTs as native tokens at the protocol level. This means they benefit from the same transaction processing, security guarantees, and network optimizations as ADA itself. The blockchain's ledger directly tracks NFT ownership and transfers without intermediary contracts.

- **No smart contracts required for basic NFT functionality**: Creating, transferring, and managing NFTs requires only standard transactions and minting policies. This eliminates the complexity and potential vulnerabilities associated with custom smart contract code. Artists and creators can mint NFTs using simple command-line tools or user-friendly interfaces without learning programming languages.

- **Lower minting costs compared to smart contract platforms**: Minting an NFT on Cardano typically costs just a few ADA, primarily covering the transaction fee and minimum UTXO requirement. This is orders of magnitude cheaper than platforms like Ethereum where gas fees for contract deployment and minting can reach hundreds of dollars. The predictable fee structure makes it viable for artists to mint entire collections affordably.

- **Inherent security of the Cardano blockchain**: NFTs automatically inherit Cardano's battle-tested security model, including its Ouroboros consensus mechanism and formal verification methods. There's no risk of smart contract exploits, reentrancy attacks, or other vulnerabilities that have plagued NFT projects on other chains. This security extends to the entire lifecycle of the NFT, from minting through countless transfers.

### Metadata Standards

Cardano's community-driven improvement proposals (CIPs) establish clear standards for NFT metadata, ensuring consistency and interoperability across the ecosystem:

- **[CIP-25](https://cips.cardano.org/cips/cip25/)**: Basic NFT metadata standard that defines how to structure NFT information including names, images, descriptions, and attributes. This standard uses the "721" metadata label (borrowed from ERC-721) and supports both on-chain and off-chain storage of metadata. It enables wallets and marketplaces to display NFTs consistently with their artwork, properties, and collection information. The standard also supports multiple file formats and additional media files beyond the primary image.

- **[CIP-68](https://cips.cardano.org/cips/cip68/)**: Reference NFT standard with on-chain metadata that introduces a dual-token system where a reference token holds metadata in its datum while a user token represents ownership. This innovative approach allows metadata updates without burning and reminting, enables programmable NFTs with dynamic properties, and ensures metadata availability directly on-chain. It's particularly useful for gaming NFTs, evolving artwork, or any use case requiring mutable attributes.

- **[CIP-27](https://cips.cardano.org/cips/cip27/)**: Royalty standard for secondary sales that enables creators to receive automatic royalties when their NFTs are resold. The standard defines how to specify royalty percentages and payment addresses within NFT metadata using the "777" label. While enforcement relies on marketplace adoption, this standard provides a consistent way for creators to communicate their royalty expectations and for marketplaces to honor them.

---

## NFT Structure

Understanding the anatomy of an NFT on Cardano is crucial for successful creation and management. Each NFT consists of four essential components that work together to create a unique, verifiable digital asset. These components define the NFT's identity, ownership rules, and visual representation.

### Essential Components

1. **Policy ID**: Unique identifier for the minting policy. This cryptographic hash represents the rules governing who can mint or burn NFTs under this policy. Once created, the Policy ID becomes immutable and serves as the primary namespace for all NFTs minted under it.

2. **Asset Name**: Unique name within the policy (often numbered). This identifier distinguishes individual NFTs within the same policy, typically using sequential numbering or unique identifiers. The combination of Policy ID and Asset Name creates a globally unique reference for each NFT on the blockchain.

3. **Metadata**: Describes the NFT properties and content. This JSON-structured data contains the NFT's visual representation, attributes, and additional information following the CIP-25 standard. Metadata can be stored on-chain or off-chain, with references to images typically pointing to IPFS for decentralized storage.

4. **Token Amount**: Usually 1 for true NFTs. Setting the amount to 1 ensures true non-fungibility, making each token unique and indivisible. While technically possible to mint multiple identical tokens, true NFTs maintain a supply of exactly one to preserve their uniqueness.

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

---

## Creating NFTs

### 1. Prepare Your Assets

Before minting NFTs, you need to store your digital assets in a location accessible via URL. IPFS (InterPlanetary File System) is the recommended storage solution for NFT images and media due to its decentralized nature and content-addressed storage that ensures permanence. Upload your artwork to IPFS either through a pinning service like Pinata or Infura, or by running your own IPFS node. Once uploaded, you'll receive a unique content hash (CID) that serves as the permanent reference to your asset, typically in the format `ipfs://QmXxxxx`.

### 2. Create Minting Policy

The minting policy defines the rules for creating and burning NFTs. For NFTs, you'll typically use either a simple signature policy for ongoing minting ability or a time-locked policy to create limited editions. The policy choice depends on whether you want to mint additional NFTs in the future or lock the supply permanently. Consider your long-term plans carefully, as the policy cannot be changed once created.

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

### 3. Mint the NFT

With your policy created and assets prepared, you can now mint your NFT. The minting transaction combines the policy script, metadata, and transaction details to create your unique token on the blockchain. Ensure your metadata JSON file follows the CIP-25 standard and references your IPFS-hosted image. The transaction will mint exactly 1 token (making it non-fungible) and send it to the specified recipient address along with the minimum ADA required for the UTXO.

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

---

## NFT Marketplaces

Once your NFTs are minted, marketplaces provide the infrastructure for buying, selling, and discovering digital collectibles. The Cardano ecosystem hosts several established marketplaces, each with unique features and communities. Understanding these platforms helps creators choose the best venue for their collections and collectors find authentic NFTs.

### Popular Cardano NFT Marketplaces

1. **jpg.store**: The largest and most popular NFT marketplace on Cardano, featuring a clean interface and advanced trading features. It supports instant buy/sell, auction formats, and collection offers, making it ideal for both creators and collectors. The platform enforces CIP-27 royalties and provides detailed analytics for collection performance.

2. **CNFT.io**: A community-driven marketplace that pioneered NFT trading on Cardano, known for its comprehensive collection statistics and rarity tools. It offers unique features like portfolio tracking, price alerts, and historical data analysis. The platform maintains strong community engagement and often features exclusive drops from popular projects.

### Listing Your NFTs

After minting, listing your NFTs on marketplaces involves several considerations to maximize visibility and sales potential:

- **Direct listing after minting**: Most marketplaces allow immediate listing once your NFT transaction is confirmed on-chain. Simply connect your wallet, select the NFT, set your price in ADA, and confirm the listing. The process typically takes just a few minutes and doesn't require additional smart contracts.

- **Royalty enforcement**: Marketplaces implementing CIP-27 automatically enforce creator royalties on secondary sales. Set your royalty percentage (typically 2.5-10%) in your NFT metadata to receive ongoing revenue from resales. Not all marketplaces enforce royalties, so research platform policies before listing.

- **Collection verification**: Verified collections receive checkmarks and enhanced visibility on marketplaces. Submit your collection information, social media links, and proof of ownership to marketplace teams for verification. This process helps protect buyers from fake collections and increases trust in your project.

- **Rarity rankings**: Marketplaces calculate rarity scores based on trait distribution within your collection. Ensure your metadata includes clear, consistent attributes to enable accurate rarity calculations. Rare NFTs often command premium prices, making proper metadata structure crucial for maximizing value.

---

## Next Steps

- Master the [Minting Process](./minting.md) for detailed NFT creation steps
- Compare with [Fungible Tokens](./tokens.md) to understand token type differences
- Build NFT applications with [Chrysalis](/docs/chrysalis/overview) for .NET-based minting
- Index NFT collections using [Argus](/docs/argus/getting-started/overview) for tracking and analytics
- Review [CIP-25](https://cips.cardano.org/cips/cip25/) for NFT metadata standards
- Explore [CIP-27](https://cips.cardano.org/cips/cip27/) for royalty implementations