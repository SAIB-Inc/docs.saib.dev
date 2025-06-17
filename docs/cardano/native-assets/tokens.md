---
title: Fungible Tokens
sidebar_position: 2
---

# Fungible Tokens on Cardano

Fungible tokens are interchangeable digital assets where each unit is identical to another. On Cardano, these tokens can represent various forms of value including cryptocurrencies, stablecoins, governance tokens, and utility tokens.

## Understanding Fungible Tokens

Fungible tokens form the backbone of digital economies on blockchain platforms, enabling everything from decentralized finance to reward systems and governance mechanisms. Understanding their fundamental properties and applications is crucial for anyone looking to create, manage, or utilize tokens on Cardano. This section explores the core characteristics that define fungibility and examines the diverse use cases that have emerged in the blockchain ecosystem.

### Characteristics

The defining properties of fungible tokens determine how they function within the Cardano ecosystem and what makes them suitable for various applications. These characteristics ensure that fungible tokens can serve as effective mediums of exchange, stores of value, and units of account in digital economies.

- **Interchangeable**: Each token unit has the same value and properties. This means that one unit of a fungible token is always equal to another unit of the same token, regardless of its transaction history or current holder. This property is essential for tokens to function as currencies or mediums of exchange, as it ensures that all participants value each unit equally. The interchangeability also simplifies accounting and trading, as there's no need to track individual token characteristics or provenance.

- **Divisible**: Can be divided into smaller units (up to 6 decimal places on Cardano). This divisibility enables precise value transfers and makes tokens suitable for micropayments and fractional ownership scenarios. Unlike physical assets that may lose functionality when divided, digital tokens maintain their utility regardless of the amount held. The 6 decimal place limitation on Cardano provides sufficient granularity for most use cases while maintaining computational efficiency. This feature allows tokens to accommodate various price points and transaction sizes, from large institutional transfers to small retail payments.

- **Uniform**: All tokens of the same type are identical. This uniformity ensures that every token within a specific policy ID and asset name combination possesses the same attributes, rights, and values. There's no variation in quality, features, or characteristics between individual units, which eliminates the need for buyers to inspect or verify specific tokens before accepting them. This standardization is crucial for market efficiency and liquidity, as it allows for instant fungibility and reduces transaction friction.

- **Transferable**: Can be freely sent between addresses. The ability to transfer tokens between wallets without restrictions is fundamental to their utility as digital assets. On Cardano, this transferability is handled natively by the blockchain protocol, ensuring secure and verifiable ownership changes. Transfers are atomic operations that either complete fully or fail entirely, preventing partial transfers or double-spending. The native asset functionality means these transfers benefit from the same security guarantees and network effects as ADA transactions.

### Common Use Cases

Fungible tokens have evolved to serve numerous purposes within the blockchain ecosystem, each addressing specific needs and creating new possibilities for digital interaction. From enabling decentralized governance to providing stable value storage, these use cases demonstrate the versatility and transformative potential of tokenization on Cardano.

1. **Utility Tokens**: Access to services or platform features. These tokens function as digital keys that unlock specific functionalities within decentralized applications or platforms, similar to how arcade tokens grant access to games. Holders can use utility tokens to pay for transaction fees, access premium features, or utilize computational resources within a ecosystem. The value of utility tokens typically correlates with the demand for the underlying service, creating a self-sustaining economic model. Many successful Cardano dApps use utility tokens to align user incentives with platform growth and sustainability.

2. **Governance Tokens**: Voting rights in DAOs and protocols. These tokens democratize decision-making by giving holders the power to influence protocol parameters, treasury allocations, and strategic directions. Each token typically represents one vote, though some protocols implement quadratic voting or other mechanisms to prevent plutocracy. Governance tokens enable truly decentralized organizations where no single entity controls the future development. On Cardano, governance tokens benefit from low transaction costs, making it economically viable for small holders to participate in voting.

3. **Stablecoins**: Tokens pegged to fiat currencies. These tokens maintain a stable value relative to traditional currencies like USD or EUR, providing a bridge between volatile crypto markets and stable fiat values. Stablecoins on Cardano can be algorithmic (like DJED) using smart contracts to maintain the peg, or asset-backed with real-world collateral. They serve as essential infrastructure for DeFi protocols, enabling lending, borrowing, and trading without exposure to cryptocurrency volatility. The efficiency of Cardano's native assets makes stablecoin transactions fast and affordable for everyday use.

4. **Reward Tokens**: Incentive mechanisms for participation. These tokens incentivize desired behaviors within ecosystems, such as providing liquidity, staking, content creation, or community engagement. Reward tokens create positive feedback loops where early participants benefit from platform growth, encouraging adoption and retention. They can be distributed through various mechanisms including liquidity mining, staking rewards, or achievement-based systems. The programmable nature of these tokens allows for sophisticated distribution schedules and vesting periods to ensure long-term alignment.

5. **Security Tokens**: Tokenized traditional securities. These tokens represent ownership in real-world assets like company shares, real estate, or commodities, bringing traditional finance onto the blockchain. Security tokens must comply with regulatory requirements, often incorporating features like whitelisting, transfer restrictions, and identity verification. They offer benefits like 24/7 trading, fractional ownership, reduced settlement times, and lower administrative costs compared to traditional securities. On Cardano, security tokens can leverage the platform's identity solutions and programmable compliance features to meet regulatory standards.

---

## Token Properties
Every token on Cardano is defined by fundamental properties that determine its identity and behavior on the blockchain. These properties create a unique fingerprint for each token while ensuring compatibility with wallets and exchanges.

### Asset Name
The human-readable name of your token (e.g., "MyToken"). This name serves as the primary identifier users see in wallets and on exchanges, making it crucial for brand recognition and user experience. The asset name must be unique within its policy ID and is encoded as hexadecimal when stored on-chain, though wallets typically display the human-readable version.

### Policy ID
A unique identifier derived from the minting policy script hash. The policy ID is a cryptographic hash that represents the rules governing token minting and burning, acting as a namespace for all tokens created under that policy. Once a policy is deployed, its ID becomes immutable, providing a permanent reference point for all tokens minted under its rules.

### Asset ID
The combination of Policy ID and Asset Name that uniquely identifies a token. This concatenated identifier ensures global uniqueness across the entire Cardano blockchain, preventing any possibility of token collision or impersonation. Wallets and applications use the asset ID to track token balances and verify authenticity when processing transactions.

### Decimals
Cardano doesn't have native decimal support, so tokens use the smallest unit (like Lovelace for ADA). Token creators must define their decimal places through metadata, allowing wallets to display user-friendly amounts while the blockchain tracks the smallest indivisible units. This approach ensures precision in calculations while maintaining compatibility with user expectations for fractional amounts.

---

## Creating Fungible Tokens

Creating fungible tokens on Cardano is a straightforward process that leverages the platform's native asset functionality to mint new tokens without smart contracts. The process involves defining a minting policy that governs token creation rules, preparing the minting transaction, and submitting it to the blockchain. This section guides you through the essential steps and considerations for successfully launching your own fungible tokens on Cardano.

### Prerequisites

1. Cardano node access
2. cardano-cli installed
3. Sufficient ADA for fees
4. Understanding of minting policies

### Basic Token Creation Process

The token creation process begins with having a minting policy that defines the rules for creating and destroying tokens. This policy generates a unique Policy ID that serves as the namespace for all tokens minted under it. The following steps assume you already have a Policy ID from your minting policy script.

Assuming you have a policy ID from your minting policy script. Policy scripts can be:
- Simple scripts (multisig, time-locked, or combination)
- Plutus scripts (smart contracts written in Plutus)
- Native scripts (JSON-based policy definitions)

All script types result in a Policy ID when hashed.

```bash
# Example: Your policy ID (this would come from your script)
POLICY_ID="your_policy_id_here"

# Token name in hexadecimal
TOKEN_NAME=$(echo -n "MyToken" | xxd -p | tr -d '\n')

# Asset ID is the combination of policy ID and token name
ASSET_ID="${POLICY_ID}.${TOKEN_NAME}"
```

### Token Metadata

Token metadata is crucial for providing essential information about your fungible tokens to wallets, exchanges, and users. The [CIP-25 standard](https://cips.cardano.org/cips/cip25/) defines how to structure this metadata to ensure compatibility across the Cardano ecosystem. Properly formatted metadata enhances user experience by displaying token names, symbols, and logos correctly in wallets, while also providing important technical details like decimal places for accurate balance calculations.

Tokens should include metadata following CIP-25 standard:

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
        "image": "ipfs://QmTokenLogo"
      }
    }
  }
}
```

Key metadata fields explained:
- **name**: The display name of your token as it appears in wallets
- **description**: A brief explanation of the token's purpose or utility
- **ticker**: The trading symbol (3-5 characters typically)
- **decimals**: Number of decimal places (0-6), crucial for proper display
- **url**: Official website or documentation link
- **image**: Token icon URL, preferably hosted on IPFS for permanence

Additional optional fields can include social media links, whitepaper URLs, and extended project information. The metadata is attached to the minting transaction and becomes permanently associated with the token, so careful consideration should be given to accuracy and completeness before minting.

---

## Managing Tokens

After successfully creating your fungible tokens, ongoing management is essential for maintaining token utility and adapting to evolving project needs. This section covers the practical aspects of token lifecycle management, including minting additional supply for growing ecosystems and burning tokens to implement deflationary mechanics or correct supply errors.

### Minting Additional Supply

Creating new tokens after the initial mint allows projects to expand supply for rewards, liquidity, or growth needs. This operation requires an open minting policy that permits additional minting beyond the initial creation. Only authorized key holders can execute these transactions, ensuring controlled supply expansion.

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

Token burning permanently removes tokens from circulation by sending them back to the minting policy with a negative mint amount. This irreversible action is used for implementing deflationary tokenomics, correcting supply errors, or consuming tokens as payment for services. Burning requires the same authorization as minting, ensuring only approved parties can reduce supply.

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

---

## Tools and Libraries

The Cardano ecosystem provides a rich set of development tools and libraries for creating and managing fungible tokens. From command-line interfaces for direct blockchain interaction to high-level SDKs in multiple programming languages, these tools cater to different skill levels and use cases. Choosing the right tool depends on your technical expertise, project requirements, and preferred development environment.

### CLI Tools

Command-line tools provide direct access to Cardano's blockchain functionality, ideal for developers who prefer terminal-based workflows or need fine-grained control over token operations.

- **cardano-cli**: The official command-line interface maintained by IOG provides comprehensive token management capabilities including minting, burning, and transferring native assets. It offers complete control over transaction construction and policy creation, making it the most flexible tool for advanced users. The CLI requires running a Cardano node or connecting to a remote node, and all operations are performed through terminal commands with JSON-based configuration files.

- **cardano-wallet**: A backend service that provides a REST API for wallet and token operations, designed for integration into applications and services. It handles wallet management, token tracking, and transaction creation with a higher-level abstraction than cardano-cli. The wallet backend automatically manages UTxOs, calculates fees, and provides transaction history, making it ideal for building user-facing applications that need reliable token functionality.

### SDKs

Software Development Kits offer language-specific libraries that abstract blockchain complexity, enabling rapid application development with native asset support.

- **Chrysalis (.NET)**: A comprehensive framework specifically highlighted in SAIB's documentation that provides full native asset support for .NET developers. Chrysalis offers strongly-typed interfaces for token operations, integrated metadata handling, and seamless integration with existing .NET applications. The framework includes built-in support for CIP standards, transaction building helpers, and async/await patterns familiar to C# developers.

- **Lucid (TypeScript)**: A modern, lightweight library for building Cardano dApps in TypeScript and JavaScript environments. Lucid simplifies token minting and management with an intuitive API, automatic UTXO selection, and built-in CIP-25 metadata support. It works seamlessly in both Node.js and browser environments, making it perfect for web applications and provides TypeScript types for enhanced developer experience.

---

## Next Steps

- Master the [Minting Process](./minting.md) for creating your fungible tokens
- Explore [NFT Creation](./nfts.md) to understand non-fungible token differences
- Implement token functionality with [Chrysalis](/docs/chrysalis/overview) for .NET applications
- Review [CIP-25](https://cips.cardano.org/cips/cip25/) for token metadata standards
- Study [CIP-26](https://cips.cardano.org/cips/cip26/) for off-chain metadata