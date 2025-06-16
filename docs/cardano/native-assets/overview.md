---
title: Overview
sidebar_position: 1
---

# Native Assets on Cardano

Native assets are a key feature of the Cardano blockchain that allows users to create, manage, and transfer custom tokens directly on the ledger without requiring smart contracts. This functionality enables the creation of both fungible tokens and non-fungible tokens (NFTs) with built-in security and efficiency.

## What are Native Assets?

Native assets on Cardano are tokens that exist alongside ADA on the blockchain's ledger. Unlike other blockchain platforms where custom tokens require smart contracts, Cardano treats all user-defined tokens as first-class citizens, providing the same level of security and functionality as ADA itself.

### Key Features

- **No Smart Contracts Required**: Tokens can be created and managed without writing complex smart contract code
- **Same Security as ADA**: Native assets inherit the same security properties as the underlying blockchain
- **Low Transaction Fees**: Minting and transferring tokens incurs minimal fees
- **Built-in Token Standards**: Standardized approach to token creation and management
- **Multi-Asset Support**: Single transaction can handle multiple different tokens

## Types of Native Assets

Cardano's native asset framework supports various token types, each designed for specific use cases and requirements. The flexibility of the system allows developers to create tokens that range from simple fungible currencies to complex non-fungible collectibles. Understanding these different types helps in choosing the right approach for your project's needs.

### 1. Fungible Tokens
Fungible tokens are interchangeable digital assets where each unit holds identical value and properties, making them perfect for currencies, utility tokens, and governance tokens. These tokens can be divided into smaller units (up to 6 decimal places on Cardano) and are commonly used in DeFi protocols for liquidity provision, yield farming, and decentralized governance. The fungibility ensures that 1 token always equals 1 token, regardless of its history or which wallet holds it. Popular examples include stablecoins like DJED, DEX tokens like MIN and SUNDAE, and protocol governance tokens that give holders voting rights in DAOs.

### 2. Non-Fungible Tokens (NFTs)
NFTs are unique, indivisible tokens that represent ownership of specific digital or physical assets, with each token having distinct properties and metadata that cannot be replicated. On Cardano, NFTs benefit from native asset functionality, meaning they don't require smart contracts for basic operations, resulting in lower costs and simpler implementation compared to other blockchains. These tokens are perfect for digital art, gaming items, identity credentials, and proof of ownership for real-world assets. The uniqueness of each NFT is guaranteed by the combination of its policy ID and asset name, with metadata stored using standards like CIP-25 and CIP-68.

### 3. Semi-Fungible Tokens
Semi-fungible tokens represent a hybrid approach where tokens share common properties within a category but maintain distinct characteristics, similar to event tickets where all VIP tickets are equivalent but different from general admission tickets. These tokens are particularly useful for gaming items (like weapons of the same type but different stats), limited edition collectibles with numbered series, or tiered membership systems. On Cardano, semi-fungible tokens can be implemented by minting multiple tokens with the same policy but different asset names and metadata. This approach provides flexibility for projects that need both the efficiency of fungible tokens and the uniqueness of NFTs.

## Use Cases

Native assets on Cardano enable various applications:

- **DeFi Tokens**: These tokens power the decentralized finance ecosystem on Cardano, enabling governance participation, liquidity provision, and yield generation mechanisms. DeFi protocols use native assets for rewarding liquidity providers, distributing protocol revenues, and allowing community members to vote on important decisions. The low transaction costs and native multi-asset support make Cardano ideal for complex DeFi operations involving multiple token types.

- **Stablecoins**: Fiat-pegged tokens provide a stable medium of exchange and store of value within the Cardano ecosystem, essential for trading, lending, and everyday transactions. These stablecoins can be algorithmic (like DJED) or backed by real-world assets, offering users protection from crypto volatility while maintaining the benefits of blockchain technology. The native asset functionality ensures these stablecoins can be transferred as efficiently as ADA itself.

- **NFT Collections**: Digital art, gaming assets, and collectibles thrive on Cardano due to the low minting costs and robust metadata standards. Artists and creators can launch entire collections without smart contract complexity, while collectors benefit from secure ownership and easy transferability. The ecosystem supports everything from profile picture collections to interactive gaming NFTs with on-chain attributes.

- **Tokenized Real-World Assets**: Property rights, securities, and commodities can be represented as native assets, bringing traditional assets onto the blockchain for improved liquidity and accessibility. This tokenization enables fractional ownership of expensive assets, 24/7 trading capabilities, and reduced administrative overhead. Regulatory compliance can be built into the minting policies, ensuring only authorized parties can create or transfer these security tokens.

- **Loyalty Points**: Businesses can create reward programs using native assets, offering customers tradeable points that have real value and utility across multiple platforms. These blockchain-based loyalty tokens prevent point expiration issues, enable peer-to-peer transfers, and can be integrated with DeFi protocols for additional earning opportunities. The transparency of blockchain also builds trust in the reward system's fairness and accuracy.

- **Access Tokens**: Membership tokens and service access rights can be implemented as native assets, providing a decentralized way to manage subscriptions, exclusive content, and community access. These tokens can grant holders special privileges like early access to products, voting rights in organizations, or entry to exclusive events. The programmable nature allows for complex access tiers and time-based permissions through minting policies.

## Advantages of Cardano Native Assets

Cardano's approach to native assets provides significant benefits over traditional smart contract-based token implementations found on other blockchains. This design philosophy prioritizes security, efficiency, and ease of use, making token creation accessible to a broader range of users and use cases. The native asset functionality is built into the core protocol, ensuring these advantages are available to all token creators without additional complexity.

1. **Simplicity**: Native assets eliminate the need for complex smart contract development, allowing users to create tokens using simple transaction commands and JSON metadata. This approach reduces the learning curve significantly, as developers don't need to master smart contract languages or worry about contract vulnerabilities. The straightforward minting process can be completed with basic command-line tools or user-friendly interfaces, making token creation accessible to non-technical users.

2. **Cost-Effective**: Transaction fees for native asset operations are substantially lower than smart contract executions, typically costing just the standard transaction fee plus a small additional amount based on the transaction size. Unlike Ethereum where complex token operations can cost hundreds of dollars in gas fees, Cardano native asset transfers cost roughly the same as regular ADA transactions. This cost efficiency makes microtransactions viable and reduces the barrier to entry for new projects.

3. **Security**: Native assets automatically inherit Cardano's robust security model without requiring additional audits or security considerations for basic token functionality. Since tokens are handled by the core protocol rather than custom smart contracts, common vulnerabilities like reentrancy attacks, integer overflows, or logic errors are eliminated. This built-in security gives users confidence that their tokens are as secure as ADA itself.

4. **Interoperability**: All Cardano wallets and tools automatically support native assets without requiring special integration or custom code, ensuring tokens work seamlessly across the entire ecosystem. This universal compatibility means tokens created today will work with wallets and services developed in the future, providing long-term sustainability. Users can send, receive, and manage all native assets using their preferred wallet without waiting for specific token support.

5. **Accounting Model**: The EUTXO model provides deterministic transaction outcomes and better predictability compared to account-based models, eliminating issues like failed transactions due to state changes. This model allows for precise calculation of transaction results before submission, preventing unexpected failures and wasted fees. The parallelizable nature of EUTXO also enables better scalability for token operations as the network grows.

## Token Lifecycle

Understanding the complete lifecycle of a native asset is crucial for planning and implementing successful token projects on Cardano. Each stage in the lifecycle serves a specific purpose and requires careful consideration of technical, economic, and regulatory factors. The flexibility of Cardano's native asset system allows projects to customize their approach at each stage while maintaining security and efficiency.

1. **Minting Policy Creation**: The foundation of any native asset begins with designing and implementing a minting policy that defines the rules governing token creation and destruction. This policy acts as an immutable contract that determines who can mint tokens, when they can be minted, and under what conditions, using simple scripts or complex Plutus smart contracts. Once deployed, the policy cannot be changed, making this initial design phase critical for the token's long-term success and requiring careful consideration of future needs.

2. **Initial Minting**: The first creation of tokens according to the established minting policy, which can range from minting the entire supply at once to creating tokens on-demand based on specific triggers. This phase involves preparing the minting transaction with appropriate metadata, ensuring sufficient ADA for fees and minimum UTXO requirements, and executing the mint operation. Projects must carefully plan their initial mint to align with their tokenomics model and distribution strategy.

3. **Distribution**: After minting, tokens need to be distributed to their intended recipients through various mechanisms such as public sales, airdrops, liquidity provision, or vesting schedules. This phase requires efficient UTXO management to minimize transaction costs, especially when distributing to many addresses, and may involve integration with DEXs or distribution platforms. Proper planning ensures fair distribution while maintaining project sustainability and community engagement.

4. **Trading**: Once distributed, tokens enter the active trading phase where they can be exchanged on decentralized exchanges, peer-to-peer transactions, or through smart contract interactions. This ongoing phase represents the token's primary utility period, where price discovery occurs, liquidity develops, and the token serves its intended purpose within the ecosystem. Projects should focus on maintaining liquidity, enabling use cases, and fostering adoption during this phase.

5. **Burning** (optional): Some tokens implement burning mechanisms to permanently remove tokens from circulation, either as part of their economic model or to correct supply issues. Burning is accomplished by sending tokens back to the minting policy with a negative mint amount, effectively destroying them forever and reducing the total supply. This mechanism can be used for deflationary tokenomics, error correction, or as part of token utility where tokens are consumed for services.

## Next Steps

Explore the following sections to dive deeper into native assets:

- [Tokens](./tokens.md) - Learn about fungible token creation and management
- [Minting](./minting.md) - Understand the minting process and policies
- [NFTs](./nfts.md) - Discover how to create and work with NFTs