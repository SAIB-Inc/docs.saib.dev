---
title: Overview
sidebar_position: 1
---

# Stake Pool Overview

A Cardano stake pool is a server that processes transactions and creates new blocks for the blockchain. When you run a stake pool, you're helping to secure the network while earning rewards for yourself and the people who delegate their ADA to your pool.

## How Stake Pools Work

Think of a stake pool as a lottery system where your chances of winning depend on how much ADA is delegated to your pool. Every second, the Cardano protocol randomly selects pools to create blocks. The more ADA delegated to your pool, the more often you'll be selected.

When your pool creates a block, you earn rewards that are automatically distributed between you (the operator) and your delegators. The entire process is non-custodial, meaning delegators keep full control of their ADA at all times.

### How Much Can You Earn?

Your earnings depend on three factors: how much ADA is delegated to your pool, your fees, and how reliably your pool operates. 

Current protocol parameters:
- **Minimum pool cost**: 170 ADA per epoch (this is the minimum fixed fee)
- **Monetary expansion**: 0.3% per epoch goes to rewards
- **Treasury cut**: 20% of rewards go to treasury
- **Optimal pool size**: ~64.4 million ADA (total stake / k parameter)

Example calculations with real numbers:

```
Pool with 1 million ADA delegated:
- Expected blocks per epoch: ~0.7 blocks
- Average reward per block: ~500 ADA
- Epoch rewards: ~350 ADA
- Operator take (170 ADA min + 1% margin): ~173 ADA
- Delegator rewards: ~177 ADA distributed

Pool with 10 million ADA delegated:
- Expected blocks per epoch: ~7 blocks
- Average reward per block: ~500 ADA
- Epoch rewards: ~3,500 ADA
- Operator take (170 ADA min + 1% margin): ~203 ADA
- Delegator rewards: ~3,297 ADA distributed
```

### Breaking Even Analysis

With current ADA price at $0.596 (December 2024) and minimum fixed fee of 170 ADA per epoch:

```
Monthly costs: $310 (recommended setup)
Monthly epochs: ~6.08 epochs
Minimum ADA from fees: 170 × 6.08 = 1,033 ADA/month
Value of minimum fees: 1,033 × $0.596 = $616/month

Result: Minimum fees alone can cover infrastructure costs
Additional margin fees are your profit
```

This is why many pools can operate with 0% margin - the 170 ADA minimum fee covers basic costs.

## Current Network Statistics

As of December 2024, the Cardano network has:
- **Active pools**: 2,997
- **Total staked**: 21.82 billion ADA (~60.6% of circulating supply)
- **k parameter**: 500 (target number of pools)
- **Saturation point**: ~64.4 million ADA per pool

You can verify current statistics:

```bash
# Set environment variables
export CARDANO_NODE_SOCKET_PATH=/path/to/node.socket
export CARDANO_NODE_NETWORK_ID=mainnet  # or testnet-magic 2 for preview

# Check current epoch and slot
cardano-cli latest query tip

# Get protocol parameters and save to file
cardano-cli latest query protocol-parameters > protocol.json
```

## Technical Requirements Summary

Based on official Cardano documentation and real-world pool operations:

### Hardware Requirements (Mainnet)

**Minimum specifications**:
- CPU: 2+ cores, 2GHz+ (Intel/AMD x86_64)
- RAM: 24GB
- Storage: 150GB (250GB recommended)
- Network: Broadband, ~1GB/hour bandwidth
- OS: 64-bit Linux (Ubuntu 20.04+, Debian 10+)

**Recommended for production**:
- CPU: 4+ cores, 3GHz+
- RAM: 32GB
- Storage: 500GB SSD
- Network: 100Mbps+ symmetric

### Infrastructure Setup

You need at least 3 servers:
1. **Block Producer**: Never exposed to internet, holds hot keys
2. **Relay 1**: Public-facing, syncs with network
3. **Relay 2**: Public-facing, different location/provider

Plus an air-gapped machine for generating cold keys (can be a laptop that never connects to internet).

### Time Commitment

Real operators report these time requirements:
- Initial learning: 20-40 hours
- Setup and testing: 20-30 hours  
- Weekly maintenance: 3-5 hours
- Staying informed: 2-3 hours/week
- Emergency response: Must respond within hours

## How Delegation Works

Understanding the delegation timeline is crucial for managing expectations:

```
Epoch N (you delegate)
  ↓ (wait ~5 days)
Epoch N+1 (snapshot taken)
  ↓ (wait ~5 days)  
Epoch N+2 (stake becomes active)
  ↓ (wait ~5 days)
Epoch N+3 (rewards calculated)
  ↓ (wait ~5 days)
Epoch N+4 (rewards distributed)
```

Total time from delegation to first rewards: 15-20 days

Key facts about delegation:
- **Delegation fee**: ~0.17 ADA (standard transaction fee)
- **Minimum to delegate**: No minimum, but very small amounts earn minimal rewards
- **Stake never leaves wallet**: Delegators maintain full control
- **No lock-up period**: Can spend or redelegate anytime
- **Rewards compound**: Automatically added to delegated stake

## Pool Fee Structure

Pools charge two types of fees set by the operator:

1. **Fixed fee**: Minimum 170 ADA per epoch (protocol enforced)
2. **Margin fee**: 0-100% of remaining rewards (operator choice)

How fees work with an example:
```
Total pool rewards: 10,000 ADA
Fixed fee to operator: 170 ADA
Remaining: 9,830 ADA
Margin (2%): 196.6 ADA to operator
Delegator rewards: 9,633.4 ADA distributed proportionally
```

Most pools charge between 0-5% margin. Some considerations:
- 0% margin pools rely solely on the 170 ADA fixed fee
- Higher margins need to offer additional value
- Saturated pools (>64.4M ADA) earn fewer rewards per ADA

## Making the Decision

Before starting a stake pool, honestly assess:

**Financial readiness**:
- Can you cover $300-400/month for 6-12 months?
- Do you have 500 ADA for the pool deposit?
- Can you pledge at least some ADA to your pool?

**Technical capability**:
- Comfortable with Linux command line?
- Can you follow technical documentation?
- Willing to learn networking and security?

**Time availability**:
- 50+ hours for initial setup and learning?
- 5+ hours weekly for maintenance?
- Available for emergency issues?

**Marketing ability**:
- Can you explain why delegators should choose you?
- Active in Cardano community?
- Have a unique value proposition?

If unsure about any of these, consider delegating first to learn the ecosystem.

## Getting Started

Your path to running a pool:

1. **Learn on testnet first**: Use preview or preprod testnet with test ADA
2. **Join the community**: SPO channels on Discord, Telegram, Forum
3. **Prepare your infrastructure**: Set up servers, practice key management
4. **Build your brand**: Website, social media, pool purpose
5. **Register on mainnet**: When confident in your setup
6. **Attract delegation**: The ongoing challenge for all pools

Essential resources:
- [Official Cardano Documentation](https://developers.cardano.org/)
- [Guild Operators Tools](https://cardano-community.github.io/guild-operators/)
- [CoinCashew Guides](https://www.coincashew.com/coins/overview-ada/guide-how-to-build-a-haskell-stakepool-node)

Next, study these technical components:
- [Pool Architecture](/docs/cardano/stake-pools/core-concepts/pool-architecture) - How pools are structured
- [Cryptographic Keys](/docs/cardano/stake-pools/core-concepts/cryptographic-keys) - Security fundamentals
- [Network Topology](/docs/cardano/stake-pools/core-concepts/network-topology) - Connecting to the network
- [Hardware Requirements](/docs/cardano/stake-pools/core-concepts/hardware-requirements) - Detailed specifications

Remember: Running a stake pool means running critical infrastructure. The network depends on reliable, committed operators who view their pools as long-term contributions to Cardano's decentralization and success.