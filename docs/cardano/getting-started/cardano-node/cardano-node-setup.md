---
title: Cardano Node Setup
sidebar_position: 2
---

# Setup Cardano Node

This guide walks you through the process of setting up a cardano-node on your system, from checking requirements to completing the installation.

---

## System Requirements

Before installing cardano-node, ensure your system meets these requirements:

### Minimum Requirements
| Component | Specification |
|-----------|--------------|
| **CPU** | 2 cores, 2 GHz or faster |
| **RAM** | 16 GB |
| **Storage** | 100 GB SSD |
| **Network** | Stable broadband connection |
| **OS** | Linux, macOS, or Windows (WSL2) |

### Recommended Requirements
| Component | Specification |
|-----------|--------------|
| **CPU** | 4+ cores, 3 GHz or faster |
| **RAM** | 32 GB |
| **Storage** | 200 GB NVMe SSD |
| **Network** | Dedicated connection, low latency |
| **OS** | Ubuntu 20.04/22.04 LTS |

:::tip[Storage Considerations]
The Cardano blockchain grows continuously. As of 2024, the mainnet blockchain size is approximately 100 GB. Plan for growth and consider using fast SSDs for optimal performance.
:::

---

## Installation Methods

Choose the installation method that best suits your needs:

### Method 1: Pre-built Binaries (Recommended)

The easiest way to get started is using official pre-compiled binaries.

#### Step 1: Create Working Directory

First, create a directory structure for your Cardano node:

```bash
mkdir -p ~/cardano-node
cd ~/cardano-node
```

#### Step 2: Download the Latest Release

Visit the official Cardano node releases page and download the appropriate binary for your system:

```bash
# For Linux systems
wget https://github.com/input-output-hk/cardano-node/releases/download/8.7.3/cardano-node-8.7.3-linux.tar.gz
```

For macOS, replace `linux` with `macos` in the URL.

#### Step 3: Extract the Archive

Extract the downloaded archive to get the binary files:

```bash
tar -xf cardano-node-8.7.3-linux.tar.gz
```

This will extract `cardano-node` and `cardano-cli` executables.

#### Step 4: Make Binaries Executable

Set the correct permissions on the extracted files:

```bash
chmod +x cardano-node
chmod +x cardano-cli
```

#### Step 5: Install to System PATH

Move the binaries to a system-wide location:

```bash
sudo mv cardano-node /usr/local/bin/
sudo mv cardano-cli /usr/local/bin/
```

#### Step 6: Verify Installation

Check that the installation was successful:

```bash
cardano-node --version
cardano-cli --version
```

You should see version information for both commands. If you get a "command not found" error, ensure `/usr/local/bin` is in your PATH.

### Method 2: Building from Source

For developers or those wanting the latest features:

#### Step 1: Install Prerequisites

First, install the required system packages.

For Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y automake build-essential pkg-config libffi-dev libgmp-dev libssl-dev libtinfo-dev libsystemd-dev zlib1g-dev make g++ tmux git jq wget libncursesw5 libtool autoconf
```

For macOS:
```bash
brew install automake libtool
```

#### Step 2: Install GHCup (Haskell Toolchain)

Install GHCup, which manages GHC and Cabal installations:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh
```

Follow the interactive installer prompts.

#### Step 3: Configure Your Shell

Source the GHCup environment:

```bash
source ~/.bashrc  # For bash users
# OR
source ~/.zshrc   # For zsh users
```

#### Step 4: Install GHC and Cabal

Install the specific versions required for building Cardano:

```bash
ghcup install ghc 8.10.7
ghcup set ghc 8.10.7
```

```bash
ghcup install cabal 3.8.1.0
ghcup set cabal 3.8.1.0
```

Verify the installations:

```bash
ghc --version
cabal --version
```

#### Step 5: Clone Cardano Node Repository

```bash
git clone https://github.com/input-output-hk/cardano-node.git
cd cardano-node
```

#### Step 6: Checkout Specific Version

```bash
git fetch --all --tags
git checkout tags/8.7.3
```

#### Step 7: Configure the Build

Update Cabal and configure the build environment:

```bash
cabal update
cabal configure --with-compiler=ghc-8.10.7
```

#### Step 8: Build Cardano Node

Build the cardano-node and cardano-cli executables:

```bash
cabal build cardano-node cardano-cli
```

This process can take 30-60 minutes depending on your system.

#### Step 9: Install the Binaries

Create a local bin directory and copy the built executables:

```bash
mkdir -p ~/.local/bin
cp -p "$(./scripts/bin-path.sh cardano-node)" ~/.local/bin/
cp -p "$(./scripts/bin-path.sh cardano-cli)" ~/.local/bin/
```

#### Step 10: Update PATH

Add the local bin directory to your PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### Step 11: Verify the Build

```bash
cardano-node --version
cardano-cli --version
```

---

## Download Configuration Files

Cardano-node requires specific configuration files for each network. These files contain network parameters and genesis information.

### Understanding Configuration Files

Before downloading, here's what each configuration file does:

| File | Purpose |
|------|---------|
| **config.json** | Main node configuration file containing operational parameters like logging levels, network protocol versions, and resource limits |
| **topology.json** | Defines network topology - which peer nodes to connect to for syncing and relaying blocks |
| **byron-genesis.json** | Genesis parameters for the Byron era (original Cardano launch) including initial UTxO distribution |
| **shelley-genesis.json** | Parameters for the Shelley era introducing staking, delegation, and decentralization features |
| **alonzo-genesis.json** | Configuration for the Alonzo era enabling smart contracts via Plutus scripts |
| **conway-genesis.json** | Latest era parameters for governance features and CIP-1694 implementation |

### Mainnet Configuration

#### Step 1: Create Configuration Directory

```bash
mkdir -p ~/cardano-node/config/mainnet
cd ~/cardano-node/config/mainnet
```

#### Step 2: Download Main Configuration File

The main configuration file controls node behavior:

```bash
wget https://book.world.dev.cardano.org/environments/mainnet/config.json
```

#### Step 3: Download Topology File

The topology file defines which nodes to connect to:

```bash
wget https://book.world.dev.cardano.org/environments/mainnet/topology.json
```

#### Step 4: Download Byron Genesis File

Byron era genesis parameters:

```bash
wget https://book.world.dev.cardano.org/environments/mainnet/byron-genesis.json
```

#### Step 5: Download Shelley Genesis File

Shelley era genesis parameters:

```bash
wget https://book.world.dev.cardano.org/environments/mainnet/shelley-genesis.json
```

#### Step 6: Download Alonzo Genesis File

Alonzo era genesis parameters (smart contracts):

```bash
wget https://book.world.dev.cardano.org/environments/mainnet/alonzo-genesis.json
```

#### Step 7: Download Conway Genesis File

Conway era genesis parameters (governance):

```bash
wget https://book.world.dev.cardano.org/environments/mainnet/conway-genesis.json
```

#### Step 8: Verify Downloads

Ensure all files were downloaded successfully:

```bash
ls -la ~/cardano-node/config/mainnet/
```

You should see all six configuration files.

### Testnet Configuration

For testing purposes, you may want to use the Preview testnet:

#### Step 1: Create Testnet Directory

```bash
mkdir -p ~/cardano-node/config/preview
cd ~/cardano-node/config/preview
```

#### Step 2: Download All Testnet Files

Download each configuration file for the Preview testnet:

```bash
wget https://book.world.dev.cardano.org/environments/preview/config.json
wget https://book.world.dev.cardano.org/environments/preview/topology.json
wget https://book.world.dev.cardano.org/environments/preview/byron-genesis.json
wget https://book.world.dev.cardano.org/environments/preview/shelley-genesis.json
wget https://book.world.dev.cardano.org/environments/preview/alonzo-genesis.json
wget https://book.world.dev.cardano.org/environments/preview/conway-genesis.json
```

#### Step 3: Verify Testnet Files

```bash
ls -la ~/cardano-node/config/preview/
```

---

## Environment Setup

Set up environment variables for easier operation:

### Step 1: Add Environment Variables

Add these lines to your shell configuration file:

```bash
echo 'export CARDANO_NODE_HOME="$HOME/cardano-node"' >> ~/.bashrc
echo 'export CARDANO_NODE_SOCKET_PATH="$CARDANO_NODE_HOME/db/node.socket"' >> ~/.bashrc
echo 'export CARDANO_NODE_NETWORK_ID="mainnet"' >> ~/.bashrc
```

### Step 2: Create Required Directories

```bash
mkdir -p ~/cardano-node/db
mkdir -p ~/cardano-node/logs
mkdir -p ~/cardano-node/scripts
```

### Step 3: Reload Shell Configuration

```bash
source ~/.bashrc
```

### Step 4: Verify Environment

```bash
echo $CARDANO_NODE_HOME
echo $CARDANO_NODE_SOCKET_PATH
```

---

## Next Steps

With cardano-node installed and configured, you're ready to:

1. **[Run your Cardano node](./run-a-node)** - Learn how to start, monitor, and maintain your node
2. **Build Cardano Applications** - Explore our development tools:
   - **[Chrysalis](/docs/chrysalis)** - Our .NET SDK for building Cardano applications in C#. Connect your new node to Chrysalis for transaction building, wallet management, and smart contract interactions
   - **[Argus](/docs/argus)** - Our powerful indexing framework that can use your node to create custom indexes and real-time data pipelines for your Cardano applications
3. **Develop Smart Contracts** - Use your local node for testing and deploying Plutus smart contracts
4. **Create a Stake Pool** - Learn how to configure your node for block production and earn rewards

Remember to keep your node software updated and monitor system resources as the blockchain grows.