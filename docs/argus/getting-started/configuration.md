---
title: Configuration
sidebar_position: 3
description: Detailed configuration options for Argus
hide_title: true
---

![Argus Configuration Banner](/img/docs/argus/getting-started/argus-config-banner.png)

This guide covers the advanced configuration options available in Argus. For basic setup, see the [Quick Start Guide](./quick-start).

## 📄 Configuration File Structure

Argus configuration is managed through the standard .NET `appsettings.json` file. The main sections relevant to Argus are:

```json
{
  "ConnectionStrings": {
    // 🗄️ Database connection settings
  },
  "CardanoNodeConnection": {
    // 🔗 Cardano node connection settings
  },
  "Sync": {
    // 🔄 Synchronization and dashboard settings
  }
}
```

## 🗄️ Database Connection

Configure your database connection in the `ConnectionStrings` section:

```json
"ConnectionStrings": {
  "CardanoContext": "Host=localhost;Database=argus;Username=postgres;Password=password;Port=5432",
  "CardanoContextSchema": "cardanoindexer"
}
```

### 🔧 Connection String Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `Host` | 🖥️ PostgreSQL server hostname or IP | Required |
| `Database` | 💾 Database name | Required |
| `Username` | 👤 Database user | Required |
| `Password` | 🔑 User password | Required |
| `Port` | 🔌 PostgreSQL server port | 5432 |
| `CardanoContextSchema` | 📋 Database schema | "public" |

## 🔗 Node Connection

Configure your connection to the Cardano blockchain in the `CardanoNodeConnection` section:

```json
"CardanoNodeConnection": {
  "ConnectionType": "UnixSocket",
  "UnixSocket": {
    "Path": "/path/to/node.socket"
  },
  "NetworkMagic": 764824073,  // 🌐 Mainnet
  "MaxRollbackSlots": 1000,    // 🛡️ Rollback protection
  "RollbackBuffer": 10,        // 🛡️ Extra safety buffer
  "Slot": 139522569,           // 🏁 Starting slot
  "Hash": "3fd9925888302fca267c580d8fe6ebc923380d0b984523a1dfbefe88ef089b66"  // 🏁 Starting block
}
```

### 🔌 Connection Types

Argus supports three connection types:

#### 1. 🌐 gRPC Provider (U5CProvider)

Remote connection using UtxoRPC:

```json
"ConnectionType": "gRPC",
"gRPC": {
  "Endpoint": "https://cardano-preview.utxorpc-m1.demeter.run",
  "ApiKey": "your_api_key"
}
```

#### 2. 🔌 Unix Socket Provider (N2CProvider)

Direct connection to a local Cardano node:

```json
"ConnectionType": "UnixSocket",
"UnixSocket": {
  "Path": "/path/to/node.socket"
}
```

#### 3. 🌐 TCP Provider (N2NProvider)

Network connection to a remote Cardano node:

```json
"ConnectionType": "TCP",
"TCP": {
  "Host": "192.168.1.100",
  "Port": 8090
}
```

### 🌍 Network Magic Values

Set the `NetworkMagic` parameter according to your target Cardano network:

| Network | Magic Value | Use Case |
|---------|-------------|----------|
| **Mainnet** | 764824073 | 🏢 Production applications |
| **Preview Testnet** | 2 | 🧪 Testing and development |
| **PreProd Testnet** | 1 | 🔍 Pre-production testing |

### 🛡️ Rollback Settings

```json
"MaxRollbackSlots": 1000,  // Maximum number of slots to rollback (hard limit)
"RollbackBuffer": 10,      // Conservative buffer to handle potential rollbacks
```

### 🏁 Starting Point

You can specify a starting point for synchronization:

```json
"Slot": 139522569,                                                        // Starting slot
"Hash": "3fd9925888302fca267c580d8fe6ebc923380d0b984523a1dfbefe88ef089b66"  // Block hash at that slot
```

If omitted, Argus will start from the genesis block or the current chain tip.

## 🔄 Synchronization Settings

Configure synchronization behavior in the `Sync` section:

```json
"Sync": {
  "Dashboard": {
    "TuiMode": true,             // 📊 Terminal-based UI
    "RefreshInterval": 5000,     // ⏱️ Update frequency
    "DisplayType": "sync"        // 📈 Dashboard style
  }
}
```

### 📊 Dashboard Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `TuiMode` | 📺 Enable terminal-based dashboard | true |
| `RefreshInterval` | ⏱️ Dashboard refresh interval (ms) | 5000 |
| `DisplayType` | 📈 Dashboard display type ("sync" or "detail") | "sync" |

## 📋 Complete Configuration Example

Here's a complete configuration example with all available options:

```json
{
  "ConnectionStrings": {
    // 🗄️ Database settings
    "CardanoContext": "Host=localhost;Database=argus;Username=postgres;Password=password;Port=5432",
    "CardanoContextSchema": "cardanoindexer"
  },
  "CardanoNodeConnection": {
    // 🔗 Blockchain connection
    "ConnectionType": "UnixSocket",
    "UnixSocket": {
      "Path": "/path/to/node.socket"
    },
    "NetworkMagic": 764824073,
    "MaxRollbackSlots": 1000,
    "RollbackBuffer": 10,
    "Slot": 139522569,
    "Hash": "3fd9925888302fca267c580d8fe6ebc923380d0b984523a1dfbefe88ef089b66"
  },
  "Sync": {
    // 🔄 Synchronization settings
    "Dashboard": {
      "TuiMode": true,
      "RefreshInterval": 5000,
      "DisplayType": "sync"
    }
  }
}
```