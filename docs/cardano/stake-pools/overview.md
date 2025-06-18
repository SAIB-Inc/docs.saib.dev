---
title: Overview
sidebar_position: 1
---

# Stake Pool Overview

Stake pools are the foundation of Cardano's Proof-of-Stake consensus mechanism, enabling the network to remain secure, decentralized, and energy-efficient while processing transactions and producing new blocks.

## What is a Stake Pool?

A stake pool is a network node that holds the combined stake of multiple participants to increase the chances of being selected to produce blocks on the Cardano blockchain. Pool operators maintain the technical infrastructure while delegators contribute their ADA stake, sharing in the rewards proportionally.

### Key Characteristics
- **Non-custodial**: Delegated ADA never leaves the owner's wallet
- **Probabilistic selection**: Block production rights based on relative stake size
- **Reward sharing**: Automatic distribution after pool fees
- **Open participation**: Anyone can operate a pool or delegate to one

---

## Technical Architecture

### Node Types

#### Block Producer Node
The block producer is the core component that creates new blocks when selected by the protocol. It:
- Runs in a secure, restricted environment
- Connects only to trusted relay nodes
- Holds the pool's block-signing keys
- Requires maximum uptime and performance

#### Relay Nodes
Relay nodes serve as the pool's interface to the wider network. They:
- Communicate with other pools and relay nodes globally
- Protect the block producer from direct exposure
- Distribute newly minted blocks across the network
- Handle the bulk of network traffic

### Cryptographic Keys

Cardano uses multiple key types for security and functionality:

| Key Type | Purpose | Storage | Rotation |
|----------|---------|---------|----------|
| **Cold Keys** | Pool identity and ownership | Offline/Air-gapped | Never |
| **VRF Keys** | Randomness for slot leader selection | Block producer | Never |
| **KES Keys** | Block signing with forward security | Block producer | Every 90 days |
| **Operational Certificate** | Links cold and hot keys | Block producer | With KES rotation |

---

## Protocol Parameters

### Saturation (k-parameter)
Saturation prevents centralization by capping optimal pool size:
- **Current k-value**: 500
- **Saturation point**: ~72 million ADA (35.8B total stake รท 500)
- **Effect**: Rewards decrease for oversaturated pools
- **Purpose**: Encourages delegators to move to smaller pools

### Pledge Mechanism (a0-parameter)
Pledge is the stake pool operator commits to their own pool:
- **Current a0**: 0.3
- **Impact**: Pools with higher pledge can earn more rewards
- **Maximum benefit**: ~23% additional rewards at full pledge
- **Security function**: Prevents Sybil attacks (creating many pools with no stake)

### Fee Structure
Pool operators set two types of fees:

| Fee Type | Description | Current Minimum | Typical Range |
|----------|-------------|-----------------|---------------|
| **Fixed Fee** | Flat amount per epoch | 340 ADA | 340-500 ADA |
| **Variable Fee** | Percentage of remaining rewards | 0% | 0%-5% |

:::info Fee Example
If a pool produces 10,000 ADA in rewards with 340 ADA fixed fee and 2% margin:
1. Fixed fee: 340 ADA to operator
2. Remaining: 9,660 ADA
3. Variable fee: 193.2 ADA to operator (2% of 9,660)
4. Delegator rewards: 9,466.8 ADA distributed proportionally
:::

---

## Requirements for Pool Operation

### Technical Skills
Running a successful stake pool requires:
- **Linux administration**: Command line proficiency, system management
- **Networking**: TCP/IP, firewalls, port forwarding, DDoS mitigation
- **Security practices**: Key management, system hardening, monitoring
- **Blockchain knowledge**: Understanding Cardano's consensus mechanism
- **DevOps skills**: Automation, monitoring, incident response

---

## Rewards and Economics

### How Rewards Work
Every epoch, the protocol:
1. **Calculates total rewards**: From transaction fees and monetary expansion
2. **Assigns slot leaders**: Based on stake distribution using VRF
3. **Rewards block producers**: For successfully created blocks
4. **Distributes to stakeholders**: After deducting pool fees

### Current Reward Parameters
- **Total reward pot**: ~0.3% of total ADA supply per epoch
- **Treasury allocation**: 20% of rewards
- **Stake pool rewards**: 80% of rewards
- **Current ROA**: ~3-4% annually (varies by pool performance)

### Performance Metrics

| Metric | Description | Impact on Rewards |
|--------|-------------|-------------------|
| **Luck** | Actual vs expected blocks | Short-term variance, evens out long-term |
| **Uptime** | Percentage of assigned blocks produced | Direct impact - missed blocks = lost rewards |
| **Height Battles** | Blocks lost to competing pools | Minor impact with good network connectivity |
| **Pledge** | Operator's committed stake | Higher pledge = slightly higher rewards |

---

## Delegation Process

### How Delegation Works
1. **Choose a pool**: Research pools based on performance, fees, and mission
2. **Delegate stake**: Use wallet to delegate (ADA stays in your control)
3. **Wait for activation**: Takes 2 epochs (10 days) to become active
4. **Receive rewards**: Automatic distribution every epoch thereafter
5. **Compound automatically**: Rewards are added to your delegated stake

### Delegation Timeline
```
Epoch N:    Delegate to pool
Epoch N+1:  Snapshot taken (delegation recorded)
Epoch N+2:  Stake becomes active
Epoch N+3:  First rewards calculated
Epoch N+4:  First rewards distributed
```

### Key Facts for Delegators
- **Minimum stake**: None (but very small amounts earn minimal rewards)
- **Lock period**: None (ADA remains liquid and spendable)
- **Risk**: No slashing - cannot lose staked ADA
- **Costs**: Small transaction fee (~0.17 ADA) to delegate

---

## Common Challenges

### For Pool Operators
1. **Attracting delegation**: Building initial stake to produce blocks
2. **Cost management**: Balancing fees with operational expenses
3. **Technical issues**: Maintaining uptime during updates/issues
4. **Competition**: Standing out among 3,000+ pools

### For Delegators
1. **Pool selection**: Evaluating performance vs. mission alignment
2. **Saturation monitoring**: Moving stake when pools grow too large
3. **Reward expectations**: Understanding variance and patience
4. **Scam awareness**: Avoiding fraudulent pools or promises

---