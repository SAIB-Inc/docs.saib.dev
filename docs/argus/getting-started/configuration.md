---
title: Configurations
sidebar_position: 4
---

# Configuration Options

---

This guide explains all available configuration options for Argus, helping you customize your blockchain indexer for your specific needs.

## 📋 Overview

Argus uses a standard .NET configuration system based on `appsettings.json`. Configuration is organized into logical sections that control different aspects of the indexer:

- 🗄️ **Database Connection**: How Argus connects to PostgreSQL
- 🔌 **Cardano Node**: How Argus connects to the Cardano blockchain
- 🔄 **Sync Settings**: Controls for the synchronization process
- 📊 **Dashboard**: Visualization and monitoring options
- 🛡️ **Rollback Settings**: Chain reorganization handling


---

## 🗄️ Database Configuration

### Connection String

The database connection settings tell Argus how to connect to your PostgreSQL database:

&nbsp;

```json
{
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=cardano_indexer;Username=postgres;Password=your_password;Port=5432",
    "CardanoContextSchema": "public"
  }
}
```

| Setting | Description | Default |
|---------|-------------|---------|
| `CardanoContext` | PostgreSQL connection string | Required |
| `CardanoContextSchema` | Database schema name | "public" |

:::tip Environment Variables
For production environments, you can use environment variables to set sensitive values:

```json
{
  "ConnectionStrings": {
    "CardanoContext": "${POSTGRES_CONNECTION_STRING}",
    "CardanoContextSchema": "${POSTGRES_SCHEMA}"
  }
}
```
:::

### Advanced Database Options

You can configure additional database settings through code when registering the DbContext:

&nbsp;

```csharp
services.AddDbContextFactory<MyDbContext>((serviceProvider, options) =>
{
    var configuration = serviceProvider.GetRequiredService<IConfiguration>();
    options.UseNpgsql(
        configuration.GetConnectionString("CardanoContext"),
        npgsqlOptions => 
        {
            // Customize history table name
            npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "public");
            
            // Set command timeout (in seconds)
            npgsqlOptions.CommandTimeout(60);
            
            // Enable sensitive data logging (for development)
            options.EnableSensitiveDataLogging(true);
        }
    );
});
```

---

## 🔌 Cardano Node Connection

Argus supports multiple ways to connect to the Cardano blockchain.

### Connection Types

There are two main connection types:

1. 🔗 **Unix Socket** (N2CProvider): Direct connection to a local Cardano node
2. 🌐 **gRPC** (U5CProvider): Remote connection to a Cardano node service (like Demeter)

### Unix Socket Configuration

For connecting to a local Cardano node:

&nbsp;

```json
{
  "CardanoNodeConnection": {
    "ConnectionType": "UnixSocket",
    "UnixSocket": {
      "Path": "/path/to/node.socket"
    },
    "NetworkMagic": 764824073,
    "Slot": 90251599,
    "Hash": "d4b8de7a11d929a323373cbab2d1d19b6b51bc6450aa4a4adeff243e7277fb38"
  }
}
```

### gRPC Configuration

For connecting to a remote Cardano node service:

&nbsp;

```json
{
  "CardanoNodeConnection": {
    "ConnectionType": "gRPC",
    "gRPC": {
      "Endpoint": "https://cardano-preview.utxorpc-m1.demeter.run",
      "ApiKey": "your_api_key"
    },
    "NetworkMagic": 2,
    "Slot": 64239299,
    "Hash": "e3a57544f2140c014691644a90021d0af36b2c6a1ef4bad713891e17dea90cae"
  }
}
```

### Common Node Connection Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `ConnectionType` | Type of connection ("UnixSocket" or "gRPC") | Required |
| `NetworkMagic` | Network identifier (2: Preview, 1: PreProd, 764824073: Mainnet) | Required |
| `Slot` | Starting slot for synchronization | Required |
| `Hash` | Block hash of the starting slot | Required |
| `MaxRollbackSlots` | Maximum rollback depth | 10000 |
| `RollbackBuffer` | Number of intersections to keep for rollback safety | 10 |

:::info Network Magic Values
- **Mainnet**: 764824073
- **PreProd Testnet**: 1
- **Preview Testnet**: 2
:::


---

## 🔄 Sync Settings

These settings control how Argus synchronizes with the blockchain.

### Global Sync Settings

```json
{
  "CardanoIndexStart": {
    "Slot": 90251599,
    "Hash": "d4b8de7a11d929a323373cbab2d1d19b6b51bc6450aa4a4adeff243e7277fb38"
  },
  "Sync": {
    "State": {
      "ReducerStateSyncInterval": 5000
    }
  }
}
```

| Setting | Description | Default |
|---------|-------------|---------|
| `CardanoIndexStart.Slot` | Global starting slot for synchronization | Required |
| `CardanoIndexStart.Hash` | Global starting block hash | Required |
| `Sync.State.ReducerStateSyncInterval` | How often to update reducer state in database (ms) | 10000 |

### Reducer-Specific Settings

```json
{
  "CardanoIndexReducers": {
    "BlockReducer": {
      "StartSlot": 90251599,
      "StartHash": "d4b8de7a11d929a323373cbab2d1d19b6b51bc6450aa4a4adeff243e7277fb38"
    },
    "TransactionReducer": {
      "StartSlot": 95000000,
      "StartHash": "f9af4a53451ba1179ea1d7beef79d788aabf27f154a0f9ed86e0a2f213e7c1e1"
    }
  }
}
```

:::tip
Reducer-specific settings override the global settings, allowing different reducers to start from different points in the blockchain.
:::

---

## 📊 Dashboard Configuration

Argus provides a real-time dashboard to monitor indexing progress.

```json
{
  "Sync": {
    "Dashboard": {
      "TuiMode": true,
      "RefreshInterval": 5000,
      "DisplayType": "full"
    }
  }
}
```

| Setting | Description | Default |
|---------|-------------|---------|
| `TuiMode` | Enable or disable the Terminal User Interface | true |
| `RefreshInterval` | Dashboard refresh interval in milliseconds | 1000 |
| `DisplayType` | Dashboard style ("full" or "sync") | "sync" |

### Dashboard Display Types

- **sync**: Simple progress bars showing completion percentage
- **full**: Comprehensive dashboard with progress, system resources, and detailed stats


---

## 🛡️ Rollback Configuration

Argus can handle chain reorganizations automatically, but you can also configure manual rollback mode.

### Standard Rollback Settings

```json
{
  "CardanoNodeConnection": {
    "MaxRollbackSlots": 10000,
    "RollbackBuffer": 10
  }
}
```

| Setting | Description | Default |
|---------|-------------|---------|
| `MaxRollbackSlots` | Maximum rollback depth (slots) | 10000 |
| `RollbackBuffer` | Number of intersections to keep for safety | 10 |

### Manual Rollback Mode

For situations requiring explicit rollback to a specific point:

&nbsp;

```json
{
  "Sync": {
    "Rollback": {
      "Enabled": true,
      "RollbackHash": "20a81db38339bf6ee9b1d7e22b22c0ac4d887d332bbf4f3005db4848cd647743",
      "RollbackSlot": 57371845,
      "Reducers": {
        "BlockReducer": {
          "Enabled": true,
          "RollbackHash": "20a81db38339bf6ee9b1d7e22b22c0ac4d887d332bbf4f3005db4848cd647743",
          "RollbackSlot": 57371845
        },
        "TransactionReducer": {
          "Enabled": false
        }
      }
    }
  }
}
```

:::warning
When rollback mode is enabled, Argus will roll back to the specified point, update reducer states, and then terminate. You must disable rollback mode to resume normal operation.
:::

---

## 📝 Logging Configuration

Argus uses the standard .NET logging system:

&nbsp;

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  }
}
```

| Setting | Description | Default |
|---------|-------------|---------|
| `LogLevel.Default` | Default logging level | "Information" |
| `LogLevel.Microsoft.AspNetCore` | ASP.NET Core logging level | "Warning" |
| `LogLevel.Microsoft.EntityFrameworkCore.Database.Command` | EF Core SQL command logging level | "Warning" |

:::tip
Set `Microsoft.EntityFrameworkCore.Database.Command` to `"Information"` to see SQL commands, which can be helpful for debugging.
:::

---

## 🧩 DApp-Specific Configuration

Some reducers require additional configuration for specific smart contracts:

&nbsp;

```json
{
  "JPGStoreMarketplaceV1ValidatorScriptHash": "c727443d77df6cff95dca383994f4c3024d03ff56b02ecc22b0f3f65", 
  "SplashScriptHash": "9dee0659686c3ab807895c929e3284c11222affd710b09be690f924d", 
  "MinswapScriptHash": "ea07b733d932129c378af627436e7cbc2ef0bf96e0036bb51b3bde6b", 
  "SundaeSwapScriptHash": "e0302560ced2fdcbfcb2602697df970cd0d6a38f94b32703f51c312b"
}
```

These script hashes identify specific smart contracts on the Cardano blockchain for DApp-specific reducers to monitor.

---

## 📂 Complete Configuration Example

Here's a complete configuration example that you can use as a starting point:

&nbsp;

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  },
  "AllowedHosts": "*",
  
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=cardano_indexer;Username=postgres;Password=your_password;Port=5432",
    "CardanoContextSchema": "public"
  },
  
  "CardanoNodeConnection": {
    "ConnectionType": "gRPC",
    "UnixSocket": {
      "Path": "/tmp/node.socket"
    },
    "gRPC": {
      "Endpoint": "https://cardano-preview.utxorpc-m1.demeter.run",
      "ApiKey": "your_api_key"
    },
    "NetworkMagic": 2,
    "MaxRollbackSlots": 10000,
    "RollbackBuffer": 10,
    "Slot": 64239299,
    "Hash": "e3a57544f2140c014691644a90021d0af36b2c6a1ef4bad713891e17dea90cae"
  },
  
  "CardanoIndexReducers": {
    "BlockReducer": {
      "StartSlot": 64239299,
      "StartHash": "e3a57544f2140c014691644a90021d0af36b2c6a1ef4bad713891e17dea90cae"
    }
  },
  
  "Sync": {
    "Rollback": {
      "Enabled": false,
      "RollbackHash": "20a81db38339bf6ee9b1d7e22b22c0ac4d887d332bbf4f3005db4848cd647743",
      "RollbackSlot": 57371845,
      "Reducers": {
        "BlockReducer": {
          "Enabled": true,
          "RollbackHash": "20a81db38339bf6ee9b1d7e22b22c0ac4d887d332bbf4f3005db4848cd647743",
          "RollbackSlot": 57371845
        }
      }
    },
    "Dashboard": {
      "TuiMode": true,
      "RefreshInterval": 5000,
      "DisplayType": "full"
    },
    "State": {
      "ReducerStateSyncInterval": 5000
    }
  },
  
  "JPGStoreMarketplaceV1ValidatorScriptHash": "c727443d77df6cff95dca383994f4c3024d03ff56b02ecc22b0f3f65", 
  "SplashScriptHash": "9dee0659686c3ab807895c929e3284c11222affd710b09be690f924d", 
  "MinswapScriptHash": "ea07b733d932129c378af627436e7cbc2ef0bf96e0036bb51b3bde6b", 
  "SundaeSwapScriptHash": "e0302560ced2fdcbfcb2602697df970cd0d6a38f94b32703f51c312b"
}
```

---

## 🔧 Environment-Specific Configuration

For different environments (development, staging, production), you can use the standard .NET approach with environment-specific configuration files:

- `appsettings.json` - Base configuration
- `appsettings.Development.json` - Development-specific overrides
- `appsettings.Production.json` - Production-specific overrides

### Example Development Configuration

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=cardano_dev;Username=dev_user;Password=dev_password;Port=5432"
  },
  "Sync": {
    "Dashboard": {
      "TuiMode": true,
      "DisplayType": "full"
    }
  }
}
```

### Example Production Configuration

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  },
  "ConnectionStrings": {
    "CardanoContext": "${POSTGRES_CONNECTION_STRING}"
  },
  "CardanoNodeConnection": {
    "ConnectionType": "gRPC",
    "gRPC": {
      "Endpoint": "${CARDANO_NODE_ENDPOINT}",
      "ApiKey": "${CARDANO_API_KEY}"
    },
    "NetworkMagic": 764824073
  },
  "Sync": {
    "Dashboard": {
      "TuiMode": false
    }
  }
}
```

:::tip
For containerized deployments, you can use environment variables to inject configuration values at runtime.
:::

---

## 📚 Next Steps

Now that you understand how to configure Argus, check out:

1. 🏗️ [Architecture Overview](architecture-overview.md) - Learn how Argus is structured
2. 🔍 [Core Concepts](../core-concepts/cardano-basics.md) - Understand the fundamental concepts
3. 🛠️ [Creating Custom Reducers](../guides/create-custom-reducer.md) - Build your own data processors

---

With proper configuration, your Argus indexer can efficiently process Cardano blockchain data according to your specific needs.