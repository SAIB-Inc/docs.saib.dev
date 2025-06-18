---
title: Pool Architecture
sidebar_position: 1
---

# Pool Architecture

Understanding the architectural components of a Cardano stake pool is essential for both operators and delegators. This guide explains how pools are structured and why each component matters.

---

## Architectural Overview

A Cardano stake pool consists of multiple interconnected nodes working together to participate in the blockchain consensus. The architecture is designed for security, reliability, and decentralization.

```
Internet ←→ Relay Nodes ←→ Block Producer Node
              ↕     ↕
         Other Pools & Nodes
```

---

## Core Components

### Block Producer Node

The block producer is the heart of your stake pool. It's responsible for creating new blocks when selected by the protocol.

#### Key Characteristics
- **Isolated**: Only connects to your own relay nodes
- **Secure**: Holds sensitive cryptographic keys
- **Critical**: Must be online when scheduled to produce blocks
- **Single instance**: Only one block producer per pool

#### What It Does
1. **Monitors slot leadership**: Checks if selected to produce blocks
2. **Creates blocks**: Assembles transactions when elected
3. **Signs blocks**: Uses pool keys to authorize new blocks
4. **Sends to relays**: Propagates blocks through relay nodes

:::warning Security Critical
The block producer should NEVER be directly exposed to the internet. All communication should go through relay nodes.
:::

### Relay Nodes

Relay nodes are the pool's interface to the Cardano network. They handle all external communication while protecting the block producer.

#### Key Characteristics
- **Public facing**: Open to connections from any node
- **Multiple instances**: Typically 2-3 relays per pool
- **Geographically distributed**: Spread across regions for resilience
- **Less sensitive**: Don't hold block-signing keys

#### What They Do
1. **Relay transactions**: Forward transactions to/from the network
2. **Propagate blocks**: Distribute newly created blocks
3. **Maintain connections**: Keep links with other pools' relays
4. **Filter traffic**: Protect block producer from malicious data

### Network Topology

The topology defines how your nodes connect to each other and the wider network.

#### Recommended Setup
```
┌─────────────────┐
│ Block Producer  │
│   (Private)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│Relay 1│ │Relay 2│
│ (USA) │ │ (EU)  │
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         │
   Cardano Network
```

---

## Connection Architecture

### Block Producer Connections
- **Incoming**: Only from your own relay nodes
- **Outgoing**: Only to your own relay nodes
- **Ports**: Custom port (not 3001) for added security
- **Firewall**: Whitelist only relay IP addresses

### Relay Node Connections
- **Incoming**: From any Cardano node (public)
- **Outgoing**: To block producer and other relays
- **Ports**: Standard port 3001 for compatibility
- **Firewall**: Rate limiting and DDoS protection

---

## Security Layers

### 1. Network Isolation
```bash
# Block Producer firewall rules (example)
- Allow inbound from Relay-1 IP on port 3000
- Allow inbound from Relay-2 IP on port 3000  
- Deny all other inbound connections
- Allow outbound to Relay IPs only
```

### 2. Key Separation
| Key Type | Location | Network Access |
|----------|----------|----------------|
| Cold keys | Offline | Never |
| KES keys | Block producer | Isolated |
| VRF keys | Block producer | Isolated |
| Node certificates | All nodes | As needed |

### 3. Geographic Distribution
Distributing nodes provides:
- **Resilience**: Survives regional outages
- **Performance**: Better global block propagation
- **Security**: Harder to attack all nodes simultaneously

---

## Performance Considerations

### Block Propagation Path
When your pool creates a block:
1. Block producer creates and signs block (&lt; 50ms)
2. Sends to relay nodes (&lt; 100ms)
3. Relays broadcast to peers (&lt; 500ms)
4. Global propagation (&lt; 5 seconds)

### Critical Timing
- **Slot duration**: 1 second
- **Target propagation**: &lt; 5 seconds globally
- **Maximum delay**: ~20 seconds before height battle

:::info Height Battles
If two pools create valid blocks for the same slot, the one that propagates faster typically wins. Good network architecture improves your chances.
:::

---

## High Availability Patterns

### Active-Passive Block Producer
Some operators run a backup block producer:
```
Primary BP ←→ Relays ←→ Network
    ↕ (monitoring)
Backup BP (offline with same keys)
```

:::caution One Active Producer
NEVER run two block producers simultaneously with the same keys. This causes "double signing" and harms the network.
:::

### Relay Redundancy
- **Minimum**: 2 relay nodes
- **Recommended**: 3 relay nodes
- **Different providers**: Avoid single points of failure
- **Load balancing**: Distribute connections evenly

---

## Monitoring Architecture

Essential monitoring points:
1. **Block Producer**:
   - Slot leader schedule
   - Block production success
   - Memory and CPU usage
   - Key rotation status

2. **Relay Nodes**:
   - Peer connections count
   - Network latency
   - Bandwidth usage
   - Sync status

3. **Overall Pool**:
   - End-to-end block propagation time
   - Missed slot analysis
   - Rewards tracking

   ---

## Common Architecture Mistakes

### ❌ Single Relay Node
**Problem**: Single point of failure
**Solution**: Always run at least 2 relays

### ❌ Public Block Producer
**Problem**: Security vulnerability
**Solution**: Isolate BP behind relays

### ❌ Same Provider for All Nodes
**Problem**: Provider outage affects entire pool
**Solution**: Diversify across providers

### ❌ Inadequate Monitoring
**Problem**: Missing issues until too late
**Solution**: Comprehensive monitoring stack

---

## Architecture Evolution

### Starting Small
Begin with minimum viable architecture:
- 1 Block Producer
- 2 Relay Nodes
- Basic monitoring

### Scaling Up
As your pool grows:
- Add third relay in different region
- Implement advanced monitoring
- Set up backup infrastructure
- Automate operations

### Enterprise Grade
For large pools:
- Multiple geographic regions
- Automated failover systems
- 24/7 monitoring team
- Disaster recovery procedures

---

## Next Steps

- Review [Hardware Requirements](/docs/cardano/stake-pools/core-concepts/hardware-requirements)
- Understand [Cryptographic Keys](/docs/cardano/stake-pools/core-concepts/cryptographic-keys)
- Plan [Network Topology](/docs/cardano/stake-pools/core-concepts/network-topology)

---