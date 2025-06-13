---
title: Run a Node
sidebar_position: 3
---

# Run Cardano Node

This guide walks you through running a Cardano node on both mainnet and testnet networks. You'll learn how to prepare your environment, download the required configuration files, start your node with the correct parameters, and verify it's syncing properly. Additionally, you'll discover essential monitoring commands and best practices for keeping your node updated to ensure reliable operation and network compatibility.

---

## Starting Your Node

### Prepare Working Directory

Before running your node, create the necessary directory structure:

```bash
# Create main directory
mkdir -p ~/cardano-node

# Create subdirectories for database and configuration
mkdir -p ~/cardano-node/db
mkdir -p ~/cardano-node/config
mkdir -p ~/cardano-node/logs

# Set appropriate permissions
chmod +x ~/cardano-node
```

:::note
If you've already created this directory structure during the [Cardano Node Setup](./cardano-node-setup#method-1-pre-built-binaries-recommended), you can skip this step and proceed directly to running your node.
:::

### Running on Mainnet

Before running your node, ensure you have the required configuration files. If you haven't downloaded them yet, use these commands:

```bash
# Download mainnet configuration files
cd ~/cardano-node/config
mkdir -p mainnet
cd mainnet

# Download the configuration files
wget https://book.world.dev.cardano.org/environments/mainnet/config.json
wget https://book.world.dev.cardano.org/environments/mainnet/topology.json
wget https://book.world.dev.cardano.org/environments/mainnet/byron-genesis.json
wget https://book.world.dev.cardano.org/environments/mainnet/shelley-genesis.json
wget https://book.world.dev.cardano.org/environments/mainnet/alonzo-genesis.json
wget https://book.world.dev.cardano.org/environments/mainnet/conway-genesis.json
```

Start your mainnet node:

```bash
cardano-node run \
  --topology ~/cardano-node/config/mainnet/topology.json \
  --database-path ~/cardano-node/db \
  --socket-path ~/cardano-node/db/node.socket \
  --config ~/cardano-node/config/mainnet/config.json \
  --port 3001
```

When your node starts successfully, you'll see:
- Initial startup messages showing the node version and configuration
- Connection attempts to peers listed in your topology file
- Chain synchronization beginning from genesis or your last sync point
- Regular log entries showing blocks being validated and chain extensions

The initial sync can take 6-12 hours on mainnet depending on your hardware and network speed.

### Running on Testnet

For testing and development, you can run a node on the Preview testnet:

```bash
# Download testnet configuration files
cd ~/cardano-node/config
mkdir -p testnet
cd testnet

# Download the configuration files
wget https://book.world.dev.cardano.org/environments/preview/config.json
wget https://book.world.dev.cardano.org/environments/preview/topology.json
wget https://book.world.dev.cardano.org/environments/preview/byron-genesis.json
wget https://book.world.dev.cardano.org/environments/preview/shelley-genesis.json
wget https://book.world.dev.cardano.org/environments/preview/alonzo-genesis.json
wget https://book.world.dev.cardano.org/environments/preview/conway-genesis.json
```

Start your testnet node:

```bash
cardano-node run \
  --topology ~/cardano-node/config/testnet/topology.json \
  --database-path ~/cardano-node/db-testnet \
  --socket-path ~/cardano-node/db-testnet/node.socket \
  --config ~/cardano-node/config/testnet/config.json \
  --port 3001
```

:::note
Testnet uses a separate database directory (`db-testnet`) to avoid conflicts with mainnet data.
:::

Testnet nodes exhibit similar startup behavior but sync much faster (typically 1-2 hours) due to the smaller blockchain size. You'll see the same log patterns but with different genesis hashes and faster block processing.

### Verify Your Node is Running

Once your node has started, you can verify it's running properly by checking the tip in a new terminal:

#### Mainnet Verification

```bash
export CARDANO_NODE_SOCKET_PATH=~/cardano-node/db/node.socket
cardano-cli query tip --mainnet
```

#### Testnet Verification

```bash
export CARDANO_NODE_SOCKET_PATH=~/cardano-node/db-testnet/node.socket
cardano-cli query tip --testnet-magic 2
```

If your node is running correctly, you'll see the current block height and sync progress.

### Command Parameters

Understanding the essential parameters for running your Cardano node helps ensure proper configuration and troubleshooting. Here are the key parameters you'll use:

| Parameter | Description |
|-----------|-------------|
| `--topology` | Path to topology.json file defining peer connections |
| `--database-path` | Directory where blockchain data is stored |
| `--socket-path` | Unix socket for local communication |
| `--config` | Main configuration file path |
| `--port` | Port number for peer connections |

---

## Node Operations & Maintenance

### Monitoring Status

Regular monitoring ensures your node stays synchronized with the network and operates reliably. This helps you catch issues early like sync problems, peer disconnections, or resource constraints.

Monitor your node's operation and synchronization using cardano-cli:

```bash
# Export socket path
export CARDANO_NODE_SOCKET_PATH=~/cardano-node/db/node.socket

# Query blockchain tip and sync status
cardano-cli query tip --mainnet
```

Output example:
```json
{
  "block": 9876543,
  "epoch": 450,
  "era": "Conway",
  "hash": "abc123...",
  "slot": 108765432,
  "syncProgress": "100.00"
}
```

Additional monitoring commands:
```bash
# Query protocol parameters
cardano-cli query protocol-parameters --mainnet

# Query current slot number for a UTC timestamp
cardano-cli query slot-number --mainnet

# Query stake pools
cardano-cli query stake-pools --mainnet
```

### Stay Updated

Keeping your Cardano node updated is essential for network security, compatibility, and performance. New releases often include critical bug fixes, protocol improvements, and optimizations that ensure your node operates correctly with the latest network consensus rules. Running outdated software can lead to sync issues, missed blocks, or incompatibility with network upgrades.

To maintain your node:
- Check the [official Cardano node releases](https://github.com/input-output-hk/cardano-node/releases) regularly
- Read release notes for breaking changes or migration requirements
- Stop your node before upgrading to prevent database corruption
- Test the new version before leaving it unattended
- Join community channels for update announcements and known issues

---

## Next Steps

Now that your node is running:

1. **Monitor Performance**: Set up comprehensive monitoring
2. **Join the Network**: Consider running a stake pool
3. **Build Applications**: Use your node for development
4. **Contribute**: Participate in the Cardano ecosystem

Remember, running a node contributes to Cardano's decentralization and gives you direct access to the blockchain. Keep your node updated and well-maintained for optimal performance.