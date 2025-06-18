---
title: Pool Architecture
sidebar_position: 1
---

# Pool Architecture

Understanding how a Cardano stake pool is structured helps you build and operate a reliable pool. This guide explains the essential components and how they work together.

## Basic Architecture

A Cardano stake pool consists of multiple servers (nodes) working together. The architecture separates the sensitive block-producing component from the public-facing relay nodes for security and reliability.

![Cardano Stake Pool Architecture](/img/pool-architecture.svg)

## Core Components

### Block Producer Node

The block producer is the core of your stake pool. It creates new blocks when your pool is selected to do so.

**Key characteristics:**
- Runs the cardano-node software in block production mode
- Holds the operational keys (KES, VRF, operational certificate)
- Never connects directly to the internet
- Only communicates with your own relay nodes
- Must be highly available during assigned slots

**Basic configuration:**
The block producer runs with these essential parameters:
```bash
cardano-node run \
  --topology block-producer-topology.json \
  --database-path db \
  --socket-path node.socket \
  --port 3000 \
  --config mainnet-config.json \
  --shelley-kes-key kes.skey \
  --shelley-vrf-key vrf.skey \
  --shelley-operational-certificate node.cert
```

### Relay Nodes

Relay nodes are your pool's connection to the Cardano network. They protect your block producer while ensuring good network connectivity.

**Key characteristics:**
- Run cardano-node without block production keys
- Have public IP addresses that other nodes can connect to
- Handle all external network traffic
- Should be geographically distributed
- Minimum of 2 relays recommended for redundancy

**Basic configuration:**
Relays run without the key parameters:
```bash
cardano-node run \
  --topology relay-topology.json \
  --database-path db \
  --socket-path node.socket \
  --port 3001 \
  --config mainnet-config.json \
  --host-addr 0.0.0.0
```

## Network Communication

The communication flow in a stake pool follows these principles:

1. **Block Producer → Relays**: Your block producer only connects to your own relay nodes
2. **Relays ↔ Relays**: Your relays connect to each other for redundancy
3. **Relays ↔ Network**: Your relays connect to other pools' relays and nodes
4. **Network → Block Producer**: Never allowed directly

This design ensures that even if a relay is compromised, your block producer remains secure.

## Minimum Setup Requirements

To run a stake pool, you need at least:

1. **One block producer node** - The secure server that creates blocks
2. **Two relay nodes** - Public-facing servers in different locations
3. **Monitoring** - Basic monitoring to ensure your pool stays online

## File Structure

A typical stake pool has these key files organized as follows:

```
/opt/cardano/
├── configuration/
│   ├── mainnet-config.json      # Node configuration
│   ├── mainnet-topology.json    # Network topology
│   ├── mainnet-byron-genesis.json
│   ├── mainnet-shelley-genesis.json
│   └── mainnet-alonzo-genesis.json
├── keys/
│   ├── kes.skey                 # KES signing key (hot)
│   ├── vrf.skey                 # VRF signing key (hot)
│   └── node.cert                # Operational certificate
├── db/                          # Blockchain database
└── node.socket                  # Unix socket for CLI
```

## Security Considerations

### Network Security

Your block producer should be protected by:
- Firewall rules that only allow connections from your relays
- Private network or VPN between block producer and relays
- No public IP address on the block producer

Example firewall setup (using ufw on Ubuntu):
```bash
# On block producer - only allow relay IPs
ufw allow from RELAY1_IP to any port 3000
ufw allow from RELAY2_IP to any port 3000
ufw default deny incoming

# On relays - allow public access
ufw allow 3001/tcp
ufw allow 22/tcp  # SSH - restrict to your IP
```

### Key Security

Different keys have different security requirements:

| Key Type          | Location       | Network Access |
|-------------------|----------------|----------------|
| Cold keys         | Offline        | Never          |
| KES keys          | Block producer | Isolated       |
| VRF keys          | Block producer | Isolated       |
| Node certificates | All nodes      | As needed      |

## Monitoring Basics

Monitor these essential metrics:

1. **Node sync status**: Ensure all nodes are fully synced
```bash
cardano-cli latest query tip
```

2. **Peer connections**: Check that nodes have adequate peers
```bash
# Check established connections
ss -tn state established '( dport = :3001 or sport = :3001 )' | wc -l
```

3. **System resources**: Monitor CPU, memory, and disk usage
```bash
# Basic resource check
top -b -n 1 | grep cardano-node
df -h | grep cardano
free -h
```

4. **KES key expiry**: Track when KES keys need rotation
```bash
cardano-cli latest query kes-period-info \
  --op-cert-file node.cert
```

## Performance Considerations

For reliable block production:

1. **Time Synchronization**: Use NTP to keep accurate time
```bash
# Install and configure NTP
sudo apt install chrony
sudo systemctl enable chrony
```

2. **Resource Allocation**: Ensure adequate resources
- Block producer: Higher CPU and memory priority
- Relays: Good network bandwidth
- All nodes: Fast SSD storage

3. **Network Latency**: Keep latency low between components
- Block producer to relays: < 50ms recommended
- Between relays: < 150ms acceptable

## Operational Best Practices

1. **Regular Updates**: Keep cardano-node software current
2. **Backup Configuration**: Keep copies of all configuration files
3. **Document Everything**: Record IP addresses, configurations, and procedures
4. **Test Failover**: Regularly test what happens if a relay fails
5. **Monitor Actively**: Don't wait for problems to find you

## Getting Started

To set up your pool architecture:

1. **Plan your infrastructure**: Decide on hosting providers and locations
2. **Set up servers**: Install operating system and basic security
3. **Install cardano-node**: Follow the official installation guide
4. **Configure topology**: Set up the connections between nodes
5. **Start with testnet**: Practice on testnet before mainnet

Remember: A well-designed architecture is the foundation of a successful stake pool. Start simple, ensure it works reliably, then optimize as you gain experience.