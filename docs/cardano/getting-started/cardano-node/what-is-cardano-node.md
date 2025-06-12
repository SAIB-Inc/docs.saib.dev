---
title: What is Cardano Node
sidebar_position: 1
---

# What is Cardano Node?

The cardano-node is the core component that powers the Cardano blockchain network. It's the software that allows you to participate in the Cardano network by validating transactions, maintaining the blockchain state, and communicating with other nodes in the network. 

As the official implementation of the Cardano protocol written in Haskell, cardano-node serves as the backbone of the network, enabling:

- **Full node operation** - Maintain a complete copy of the blockchain
- **Transaction validation** - Verify and propagate transactions across the network  
- **Block production** - Create new blocks when running as a stake pool
- **Network participation** - Connect and communicate with other nodes globally
- **API access** - Provide interfaces for wallets and applications to interact with the blockchain

---

## Core Components

### Consensus Layer
The consensus layer implements the Ouroboros proof-of-stake protocol, which determines how new blocks are created and added to the blockchain. This layer manages slot leader selection based on stake distribution, ensuring that block production remains decentralized and secure. It also:
- Enforces protocol rules for block validation
- Implements chain selection logic to handle competing chains
- Follows the longest valid chain principle for consensus

### Networking Layer
The networking layer facilitates peer-to-peer communication between nodes across the global Cardano network. It handles node discovery protocols to find and connect with other nodes. Key responsibilities include:
- Managing efficient propagation of blocks and transactions
- Maintaining optimal network topology
- Implementing security measures against network-level attacks
- Ensuring reliable data transmission in adverse conditions

### Storage Layer
The storage layer efficiently manages all blockchain data using a specialized database optimized for blockchain operations. It maintains the complete history of all blocks and transactions while providing fast access to current state information. Core functions include:
- Managing the UTXO set for transaction validation
- Implementing caching mechanisms for performance optimization
- Performing data integrity checks
- Ensuring blockchain consistency and tamper-proof storage

### API Layer
The API layer provides multiple interfaces for external applications to interact with the node. It exposes a local Unix socket for secure communication with cardano-cli and other local tools. The layer enables:
- Administrative operations and queries
- Transaction submission interfaces
- Blockchain state queries
- Node health monitoring
- Seamless integration for wallets and exchanges

---

## Why Run a Cardano Node?

### Network Participation
Running a cardano-node directly contributes to the strength and resilience of the Cardano network. Every additional node increases the network's decentralization, making it more resistant to attacks and censorship. By participating, you:
- Help validate transactions and propagate blocks
- Maintain the integrity of the blockchain
- Ensure efficient transaction processing
- Support Cardano's vision of a decentralized financial system

### Direct Blockchain Access
Operating your own node provides unmediated access to the Cardano blockchain, eliminating dependence on third-party services. With your own node, you can:
- Query any blockchain data instantly
- Submit transactions directly without external APIs
- Monitor specific addresses or smart contracts in real-time
- Ensure maximum privacy for your operations
- Have complete confidence in data accuracy

### Stake Pool Operation
Running a stake pool requires operating one or more cardano-nodes configured for block production. Pool operators benefit from:
- Earning rewards for successfully producing blocks
- Charging fees for staking services
- Creating a sustainable business model
- Participating in Cardano's governance
- Contributing to network security
- Providing valuable services to ADA holders

---

## Integration Points

### Command Line Interface (CLI)
The `cardano-cli` tool provides comprehensive command-line access to all node functions:
- Transaction building and signing
- Address generation and verification
- Blockchain queries and state inspection
- Stake pool operations and certificate management

### APIs and Tools
Integration with various tools and frameworks:
- **[Chrysalis](/docs/chrysalis)**: A .NET SDK that can connect directly to cardano-node for building Cardano applications in C#. It provides high-level abstractions for transaction building, smart contract interaction, and blockchain queries.
- **[Argus](/docs/argus)**: An indexing framework that can use cardano-node as a data source for building custom indexes and real-time data processing pipelines. This enables efficient querying of blockchain data for analytics and application backends.
- **cardano-cli**: Command-line interface for interacting with the node, building transactions, and managing keys
- **cardano-submit-api**: HTTP API for transaction submission
- **cardano-db-sync**: PostgreSQL database synchronization for complex queries

---

## Network Architecture

Cardano operates multiple networks to serve different purposes, from production use to testing and development. Each network runs the same protocol but with different parameters and purposes, allowing users to choose the appropriate environment for their needs.

### Mainnet
The mainnet is Cardano's production network where real economic value is exchanged and all transactions are permanent. Operating a mainnet node means participating in the actual Cardano economy, where stake pools earn real rewards and smart contracts handle real assets. The mainnet represents the culmination of years of research and development, running the fully-featured Cardano protocol with all its capabilities.

### Testnets
Testnets provide safe environments for testing and experimentation without risking real funds. The Preview testnet receives new features first, allowing developers to test upcoming functionality before it reaches mainnet. PreProd testnet mirrors mainnet more closely and serves as a final testing ground before production deployments. Developers can also create private testnets for isolated testing environments or specific testing scenarios.

---

## Next Steps

Now that you understand what cardano-node is, you can:

1. **[Set up your Cardano node](./cardano-node-setup)** - Follow our step-by-step installation guide
2. **[Run and maintain your node](./run-a-node)** - Learn operational best practices
3. **Start Building with SAIB Tools**:
   - **[Chrysalis](/docs/chrysalis)** - Build Cardano applications in .NET/C# with our comprehensive SDK
   - **[Argus](/docs/argus)** - Index and query blockchain data efficiently with our powerful framework
4. **Explore Integration Options** - Connect your applications directly to your node for maximum control

The cardano-node is your gateway to participating in the Cardano network. Combined with SAIB's development tools, you have everything needed to build powerful Cardano applications.