---
title: Relay Node Configuration
sidebar_position: 3
---

# Relay Node Configuration

Relay nodes serve as the communication bridge between your stake pool and the Cardano network. This guide covers the essential configuration steps following Cardano's official specifications.

:::info Prerequisites
Before configuring relay nodes:
- Review [Pool Architecture](/docs/cardano/stake-pools/core-concepts/pool-architecture) to understand relay's role
- Ensure [Hardware Requirements](/docs/cardano/stake-pools/core-concepts/hardware-requirements) are met
- Have cardano-node installed on your system
:::

## Required Configuration Files

A relay node requires several configuration files to operate correctly. These files define network parameters, peer connections, and operational settings.

### Core Configuration Files

Every relay node needs these files from the Cardano network:

1. **config.json** - Main node configuration parameters
2. **byron-genesis.json** - Byron era genesis parameters
3. **shelley-genesis.json** - Shelley era genesis parameters
4. **alonzo-genesis.json** - Alonzo era genesis parameters
5. **conway-genesis.json** - Conway era genesis parameters
6. **topology.json** - Peer connection definitions

Download these files from the Cardano environments repository for your target network (mainnet, preprod, or preview).

## Relay vs Block Producer Configuration

The key differences in relay configuration compared to block producers center on network accessibility and security. Relay nodes must accept incoming connections from any IP address, allowing them to serve as public endpoints. They connect to many external peers to ensure good network propagation. Most importantly, relay nodes never have access to any private keys used for block production.

Block producers, in contrast, only connect to your own relay nodes and reject all external connection attempts. This isolation protects the sensitive keys required for block production.

## Basic Relay Setup

### Directory Structure

Create a organized directory structure for your relay node:

```bash
mkdir -p /opt/cardano/relay/{config,db,logs}
cd /opt/cardano/relay
```

Place all configuration files in the config directory. The db directory will store the blockchain data, requiring at least 150GB of available space.

### Node Startup Command

Start your relay node with these essential parameters:

```bash
cardano-node run \
  --topology /opt/cardano/relay/config/topology.json \
  --database-path /opt/cardano/relay/db \
  --socket-path /opt/cardano/relay/node.socket \
  --host-addr 0.0.0.0 \
  --port 6000 \
  --config /opt/cardano/relay/config/config.json
```

The critical parameter here is `--host-addr 0.0.0.0`, which allows the node to accept connections from any IP address. The standard port is 6000, though you can use a different port if needed.

## Topology Configuration

The topology file determines which nodes your relay connects to. Cardano supports two topology formats: legacy (Producers) and P2P (LocalRoots/PublicRoots).

### Legacy Topology Format

For traditional topology configuration, specify each peer individually:

```json
{
  "Producers": [
    {
      "addr": "YOUR_BLOCK_PRODUCER_IP",
      "port": 6000,
      "valency": 1
    },
    {
      "addr": "relays.cardano-mainnet.iohk.io",
      "port": 3001,
      "valency": 2
    }
  ]
}
```

The valency parameter indicates how many connections to maintain with each peer or peer group.

### P2P Topology Format

The newer P2P topology format provides automatic peer discovery:

```json
{
  "localRoots": [
    {
      "accessPoints": [
        {
          "address": "YOUR_BLOCK_PRODUCER_IP",
          "port": 6000
        }
      ],
      "advertise": false,
      "valency": 1
    }
  ],
  "publicRoots": [
    {
      "accessPoints": [
        {
          "address": "relays.cardano-mainnet.iohk.io",
          "port": 3001
        }
      ],
      "advertise": false
    }
  ],
  "useLedgerAfterSlot": 110332824
}
```

The P2P format enables dynamic peer discovery after the specified slot number.

## System Service Configuration

For production operation, configure your relay as a system service for automatic startup and restart capabilities.

### Creating the Service File

Create `/etc/systemd/system/cardano-relay.service`:

```ini
[Unit]
Description=Cardano Relay Node
After=network.target

[Service]
Type=simple
User=cardano
Group=cardano
WorkingDirectory=/opt/cardano/relay
ExecStart=/usr/local/bin/cardano-node run \
  --topology /opt/cardano/relay/config/topology.json \
  --database-path /opt/cardano/relay/db \
  --socket-path /opt/cardano/relay/node.socket \
  --host-addr 0.0.0.0 \
  --port 6000 \
  --config /opt/cardano/relay/config/config.json

KillSignal=SIGINT
RestartKillSignal=SIGINT
TimeoutStopSec=300
LimitNOFILE=32768
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=cardano-relay

[Install]
WantedBy=multi-user.target
```

### Managing the Service

Enable and start the relay service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cardano-relay
sudo systemctl start cardano-relay
```

Monitor the service status:
```bash
sudo systemctl status cardano-relay
journalctl -u cardano-relay -f
```

## Network Configuration

### Firewall Setup

Configure your firewall to allow relay connections:

```bash
# Allow Cardano relay port
sudo ufw allow 6000/tcp

# Allow SSH (restrict to your IP)
sudo ufw allow from YOUR_IP to any port 22

# Enable firewall
sudo ufw enable
```

### Verifying Connectivity

Test that your relay is accessible:

```bash
# From external machine
nc -zv YOUR_RELAY_IP 6000

# Check listening ports locally
sudo netstat -tlnp | grep 6000
```

## Monitoring and Maintenance

### Checking Sync Status

Monitor your relay's synchronization:

```bash
cardano-cli query tip --socket-path /opt/cardano/relay/node.socket
```

The syncProgress field should show 100.00 when fully synchronized.

### Viewing Logs

Check relay logs for issues:

```bash
journalctl -u cardano-relay --since "1 hour ago"
journalctl -u cardano-relay -f  # Follow logs in real-time
```

### Topology Updates

To reload topology changes without restarting:

```bash
# Send SIGHUP signal to reload topology
sudo systemctl kill -s HUP cardano-relay

# Alternative method
pkill -HUP cardano-node
```

The SIGHUP signal causes the node to reload its topology configuration without a full restart.

## Security Considerations

Relay nodes face the public internet and require appropriate security measures:

1. **No Private Keys**: Never store any pool keys on relay nodes
2. **Regular Updates**: Keep cardano-node and system packages updated
3. **Access Control**: Use firewall rules to limit access
4. **Resource Limits**: Set appropriate systemd limits to prevent DoS

## Performance Optimization

### File Handle Limits

Cardano nodes require many file handles. The systemd service sets `LimitNOFILE=32768`, but verify system-wide limits:

```bash
# Check current limits
ulimit -n

# Set in /etc/security/limits.conf if needed
cardano soft nofile 32768
cardano hard nofile 32768
```

### Database Optimization

Place the database on fast storage (SSD recommended) with sufficient space for growth. The blockchain grows approximately 2-3GB monthly.

## Common Issues and Solutions

### Node Won't Start

Check configuration file paths in your startup command. Verify all genesis files are present and readable. Ensure the database directory has sufficient space and correct permissions.

### Slow Synchronization

Verify your internet connection speed. Check that you have enough peers in your topology. Consider adding closer geographic peers for better performance.

### Connection Issues

If peers cannot connect, verify firewall rules allow port 6000. Check that --host-addr is set to 0.0.0.0. Confirm your public IP is correct if behind NAT.

## Next Steps

After configuring your relay:

1. Wait for full synchronization before registering the pool
2. Add your relay endpoints to your pool metadata
3. Share your relay address with other SPOs for topology inclusion
4. Monitor performance and adjust topology as needed

For detailed installation instructions, consult the official Cardano documentation. For understanding how relays integrate with your pool, see [Network Topology](/docs/cardano/stake-pools/core-concepts/network-topology).