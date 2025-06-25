---
title: Network Topology
sidebar_position: 3
---

# Network Topology

Network topology defines how your stake pool nodes connect to each other and the Cardano network. A properly designed topology ensures reliable block propagation, security against attacks, and resilience to network failures.

## Understanding Topology Basics

In Cardano, each node maintains a list of peers it connects to. These connections are bidirectional TCP connections on port 3001 (by default). Your topology configuration determines:
- Which nodes your pool connects to
- How many connections to maintain
- Whether to accept incoming connections
- How to handle peer discovery

## Basic Pool Topology

The fundamental principle of stake pool topology is separation of concerns: your block producer must remain isolated from the public internet, while relay nodes handle all external communication.

![Stake Pool Network Topology](/img/stake-pool-topology.svg)

### Minimum Secure Setup

At minimum, you need:
1. **One Block Producer**: Never exposed to the internet
2. **Two Relay Nodes**: Public-facing, in different locations

This setup provides basic redundancy and security. If one relay fails, your pool can still produce blocks through the other relay.

### Production Topology Configuration

For your block producer, create a topology file that ONLY lists your relay nodes:

```json
{
  "Producers": [
    {
      "addr": "10.0.1.10",
      "port": 3001,
      "valency": 1
    },
    {
      "addr": "10.0.2.10",
      "port": 3001,
      "valency": 1
    }
  ]
}
```

Replace the IP addresses with your actual relay IPs. The block producer should never connect to external nodes.

For relay nodes, include your block producer and external peers:

```json
{
  "Producers": [
    {
      "addr": "10.0.0.5",
      "port": 3000,
      "valency": 1
    },
    {
      "addr": "relay1.example-pool.com",
      "port": 3001,
      "valency": 1
    },
    {
      "addr": "relay2.another-pool.com",
      "port": 3001,
      "valency": 1
    }
  ]
}
```

The first entry should be your block producer IP. Add 10-20 external pool relays for good connectivity. The "valency" of 1 maintains an active connection.

## P2P Topology (Modern Approach)

Cardano now supports P2P (peer-to-peer) topology, which automatically finds and connects to other nodes. This is becoming the standard for new pools.

![P2P vs Legacy Topology](/img/p2p-topology.svg)

With P2P mode, your node will:
- Automatically discover other nodes
- Maintain optimal connections
- Improve block propagation

P2P configuration is more complex than legacy topology. Most new operators start with legacy topology and migrate to P2P once comfortable with pool operations.

## Geographic Distribution

Placing your relay nodes in different locations improves your pool's performance and reliability.

### Choosing Relay Locations

Consider these factors when placing relays:
1. **Distance from block producer**: Closer is generally better
2. **Different providers**: Don't put all relays with one hosting company
3. **Major regions**: Consider where most Cardano nodes are located

Common relay locations:
- North America (US East/West Coast)
- Europe (Germany, Netherlands)
- Asia (Singapore, Japan)

### Testing Network Speed

Check the connection speed between your nodes:

```bash
# Simple ping test
ping -c 10 relay1.yourpool.com

# Look for the average time at the bottom
# Good: less than 50ms to block producer
# Acceptable: less than 150ms between relays
```

## Monitoring Topology Health

### Checking Connections

Monitor how many peers your node is connected to:

```bash
# Count active connections
ss -tn state established | grep :3001 | wc -l

# Check if node is synced
cardano-cli latest query tip
```

Look for:
- At least 5-10 peer connections for relays
- Sync progress at 100.00
- Current slot close to network tip

### Basic Health Checks

Create a simple monitoring routine:

```bash
# Check peer count
echo "Active connections:"
ss -tn state established | grep :3001 | wc -l

# Check sync status
echo "Node sync status:"
cardano-cli latest query tip | grep sync

# Check if cardano-node is running
echo "Node process:"
ps aux | grep cardano-node | grep -v grep
```

If peer count drops below 5 or sync isn't at 100%, investigate potential issues.

## Troubleshooting Common Issues

### No Incoming Connections

If your relay isn't getting connections:

```bash
# Test if port is open from another server
nc -zv relay.yourpool.com 3001

# Check local port is listening
sudo netstat -tlnp | grep 3001
```

Common causes:
- Port 3001 not open in firewall
- Wrong IP in topology files
- Node not fully synced yet

### Connection Problems

If having trouble connecting to other nodes:

```bash
# Test connection to a peer
ping relay.example.com

# Check DNS resolution
nslookup relay.example.com
```

Common fixes:
- Verify IP addresses in topology.json
- Ensure DNS names resolve correctly
- Check network connectivity

## Best Practices

1. **Regular Updates**: Update your topology connections monthly
2. **Peer Diversity**: Connect to pools of various sizes
3. **Monitor Continuously**: Set up alerts for connection drops
4. **Document Everything**: Keep records of all topology changes
5. **Test Failover**: Regularly test relay failures

## Next Steps

- Configure [Hardware Requirements](/docs/cardano/stake-pools/reference/hardware-requirements) for optimal performance
- Study [Pool Architecture](/docs/cardano/stake-pools/reference/pool-architecture) for complete system design
- Implement monitoring for your topology

Remember: Your network topology is your pool's connection to the Cardano network. A well-designed topology ensures your blocks reach the network quickly and reliably.