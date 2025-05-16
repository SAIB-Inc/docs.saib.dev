---
title: Installation Guide
sidebar_position: 2
description: Comprehensive guide for installing and configuring Argus, a .NET indexing framework for Cardano
---

# Argus Installation Guide

This guide walks you through the complete process of installing and configuring Argus for your Cardano blockchain applications. By following these steps, you'll have a fully functional Argus instance ready to index and process blockchain data.

## System Requirements

Before installing Argus, ensure your development environment meets the following requirements:

### Required Software

| Component | Version | Notes |
|-----------|---------|-------|
| **.NET SDK** | 9.0 or later | [Download .NET](https://dotnet.microsoft.com/download) |
| **PostgreSQL** | 12.0 or later | [Download PostgreSQL](https://www.postgresql.org/download/) |
| **Entity Framework Core** | 8.0 or later | Installed via NuGet |

### Hardware Recommendations

For optimal performance, especially when processing the entire Cardano blockchain, we recommend:

- **CPU**: 4+ cores
- **RAM**: 8+ GB
- **Storage**: 100+ GB SSD (depending on indexing scope)
- **Network**: Stable internet connection

:::tip Performance Optimization
Running Argus on the same machine as your Cardano node using the UnixSocket provider significantly improves performance by reducing network latency.
:::

## Installation Process

### 1. Create a New .NET Project

Start by creating a new .NET project if you don't already have one:

```bash
# Create a new ASP.NET Core Web API project
dotnet new webapi -n MyArgusIndexer

# Navigate to the project directory
cd MyArgusIndexer
```

### 2. Add Argus NuGet Packages

Install the Argus library and required dependencies using NuGet:

```bash
# Add the Argus core package
dotnet add package Argus.Sync --version 0.3.1-alpha

# Add Entity Framework Core packages
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

Alternatively, you can add the packages through the Package Manager Console in Visual Studio:

```powershell
Install-Package Argus.Sync -Version 0.3.1-alpha
Install-Package Microsoft.EntityFrameworkCore.Design
Install-Package Npgsql.EntityFrameworkCore.PostgreSQL
```

:::note Package Versions
Always check the [Argus GitHub repository](https://github.com/SAIB-Inc/Argus) for the latest version numbers. Compatibility between packages is essential for proper operation.
:::

## Database Configuration

Argus uses PostgreSQL to store indexed blockchain data. Follow these steps to set up and configure your database.

### 1. Create a PostgreSQL Database

First, create a dedicated PostgreSQL database for your Argus data:

```bash
# Using psql command line
psql -U postgres -c "CREATE DATABASE argus_db;"

# Or using createdb utility
createdb -U postgres argus_db
```

### 2. Configure Connection Strings

Add your database connection details to `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=argus_db;Username=postgres;Password=your_password;Port=5432",
    "CardanoContextSchema": "public"
  }
}
```

#### Connection String Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `Host` | PostgreSQL server hostname or IP | `localhost`, `192.168.1.100` |
| `Database` | Name of your PostgreSQL database | `argus_db` |
| `Username` | Database user with proper permissions | `postgres` |
| `Password` | The user's password | `your_password` |
| `Port` | PostgreSQL server port | `5432` (default) |
| `CardanoContextSchema` | Database schema to use | `public` (default) |

:::caution Security Warning
Never commit sensitive credentials to source control. For production environments, use environment variables, user secrets, or a secure key vault service.
:::

## Connecting to Cardano

Argus provides multiple ways to connect to the Cardano blockchain. Choose the one that best fits your use case.

### 1. Configure Node Connection

Add your Cardano node connection details to `appsettings.json`:

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

### 2. Connection Provider Options

Argus supports three main connection types, each with its own advantages:

#### gRPC Provider (U5CProvider)

```json
"ConnectionType": "gRPC",
"gRPC": {
  "Endpoint": "https://cardano-preview.utxorpc-m1.demeter.run",
  "ApiKey": "your_api_key"
}
```

- **Best for**: Cloud deployments, remote connections
- **Advantages**: No need to run your own Cardano node
- **Considerations**: Requires API key, potentially higher latency

#### Unix Socket Provider (N2CProvider)

```json
"ConnectionType": "UnixSocket",
"UnixSocket": {
  "SocketPath": "/path/to/node.socket"
}
```

- **Best for**: Local development, production deployments with direct node access
- **Advantages**: Highest performance, direct node communication
- **Considerations**: Requires a local Cardano node, Unix-compatible systems only

#### TCP Provider (N2NProvider)

```json
"ConnectionType": "TCP",
"TCP": {
  "Host": "192.168.1.100",
  "Port": 8090
}
```

- **Best for**: Network access to remote Cardano nodes
- **Advantages**: Works across network boundaries
- **Considerations**: Performance depends on network conditions (currently in development)

### 3. Network Magic Values

Set the `NetworkMagic` parameter according to your target Cardano network:

| Network | Magic Value | Purpose |
|---------|-------------|---------|
| **Mainnet** | 764824073 | Production environment |
| **Preview Testnet** | 2 | Testing environment |
| **PreProd Testnet** | 1 | Pre-production testing |

## Implementing the Database Context

Entity Framework Core provides the data access layer for Argus. You'll need to create a custom DbContext class.

### 1. Create the DbContext Class

Create a new file called `MyDbContext.cs` with the following content:

```csharp
using Argus.Sync.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MyArgusIndexer.Data
{
    // Define your DbContext interface
    public interface IMyDbContext
    {
        // Your DbSets will be defined here
    }

    // Implement the database context
    public class MyDbContext : CardanoDbContext, IMyDbContext
    {
        public MyDbContext(
            DbContextOptions<MyDbContext> options,
            IConfiguration configuration
        ) : base(options, configuration)
        {
        }

        // DbSet properties will be added as you create reducers
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Call the base implementation first
            base.OnModelCreating(modelBuilder);
            
            // Add your model configurations here
        }
    }
}
```

### 2. Register Services in Dependency Injection

Update your `Program.cs` file to register Argus services:

```csharp
using Microsoft.EntityFrameworkCore;
using MyArgusIndexer.Data;
using Argus.Sync.Extensions;
using Argus.Sync.Models;

var builder = WebApplication.CreateBuilder(args);

// Add controllers and other services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add database context
builder.Services.AddDbContextFactory<MyDbContext>((serviceProvider, options) =>
{
    var configuration = serviceProvider.GetRequiredService<IConfiguration>();
    options.UseNpgsql(
        configuration.GetConnectionString("CardanoContext"),
        npgsqlOptions => npgsqlOptions.MigrationsHistoryTable(
            "__EFMigrationsHistory", 
            configuration.GetValue<string>("ConnectionStrings:CardanoContextSchema")
        )
    );
});

// Add Argus to the dependency injection container
builder.Services.AddCardanoIndexer<MyDbContext>(builder.Configuration);

// Register reducers (you'll implement these in the next section)
builder.Services.AddReducers<MyDbContext, IReducerModel>([
    // Your reducers will be listed here
]);

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

## Adding Your First Reducer

Reducers are the core components that process blockchain data. Here's how to create a simple reducer.

### 1. Create a Block Indexer Reducer

Create a new file called `BlockReducer.cs`:

```csharp
using System;
using System.Linq;
using System.Threading.Tasks;
using Argus.Sync.Interfaces;
using Cardano.Node.Models;
using Microsoft.EntityFrameworkCore;
using MyArgusIndexer.Data;
using MyArgusIndexer.Models;

namespace MyArgusIndexer.Reducers
{
    public class BlockReducer : IReducer<BlockInfo>
    {
        private readonly IDbContextFactory<MyDbContext> dbContextFactory;

        public BlockReducer(IDbContextFactory<MyDbContext> dbContextFactory)
        {
            this.dbContextFactory = dbContextFactory;
        }

        public async Task RollForwardAsync(Block block)
        {
            // Extract data from the block
            string hash = block.Header().Hash();
            ulong slot = block.Header().HeaderBody().Slot();
            
            // Store it in your database
            using var db = await dbContextFactory.CreateDbContextAsync();
            db.Blocks.Add(new BlockInfo
            {
                Hash = hash,
                Slot = slot,
                ProcessedAt = DateTime.UtcNow
            });
            await db.SaveChangesAsync();
        }

        public async Task RollBackwardAsync(ulong slot)
        {
            // Handle rollbacks when chain reorganizations occur
            using var db = await dbContextFactory.CreateDbContextAsync();
            var blocksToRemove = await db.Blocks
                .Where(b => b.Slot >= slot)
                .ToListAsync();
                
            if (blocksToRemove.Any())
            {
                db.Blocks.RemoveRange(blocksToRemove);
                await db.SaveChangesAsync();
            }
        }
    }
}
```

### 2. Create the BlockInfo Model

Create a new file called `BlockInfo.cs`:

```csharp
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Argus.Sync.Models;

namespace MyArgusIndexer.Models
{
    [Table("Blocks")]
    public class BlockInfo : IReducerModel
    {
        [Key]
        public string Hash { get; set; }
        
        [Required]
        public ulong Slot { get; set; }
        
        [Required]
        public DateTime ProcessedAt { get; set; }
    }
}
```

### 3. Update Your DbContext

Update your `MyDbContext.cs` file to include the BlockInfo DbSet:

```csharp
public interface IMyDbContext
{
    DbSet<BlockInfo> Blocks { get; set; }
}

public class MyDbContext : CardanoDbContext, IMyDbContext
{
    public DbSet<BlockInfo> Blocks { get; set; }
    
    // ... rest of the class
}
```

### 4. Register the Reducer

Update your `Program.cs` file to register the new reducer:

```csharp
// Register reducers
builder.Services.AddReducers<MyDbContext, IReducerModel>([
    typeof(BlockReducer)
]);
```

## Running the Application

Now that everything is set up, you can start your Argus indexer.

### 1. Create the Database

Run migrations to create your database schema:

```bash
# Create a migration
dotnet ef migrations add InitialCreate --context MyDbContext

# Apply the migration
dotnet ef database update
```

### 2. Start the Application

Run your application to begin indexing the blockchain:

```bash
dotnet run
```

### 3. Verify the Installation

To confirm that Argus is running correctly:

1. Check your database to see if the `Blocks` and `ReducerStates` tables are created
2. Monitor your application logs for successful blockchain synchronization
3. Use a database tool like pgAdmin to view indexed data

:::tip Monitoring Progress
Argus includes a dashboard for tracking synchronization progress. You can access it at `/api/dashboard` in your application.
:::

## Advanced Configuration

### Scaling for Production

For production deployments, consider these optimization strategies:

1. **Database Indexing**: Create appropriate indexes for your queries
2. **Connection Pooling**: Adjust connection pool settings based on your workload
3. **Resource Allocation**: Allocate adequate CPU and memory resources
4. **Batch Processing**: Configure batch sizes for optimal throughput

### Performance Optimization Settings

Add these settings to your `appsettings.json` file for performance tuning:

```json
{
  "CardanoIndexerOptions": {
    "MaxConcurrency": 4,
    "MaxItemsPerBatch": 1000,
    "PollingIntervalMs": 1000,
    "EnableDashboard": true
  }
}
```

| Setting | Description | Default | Recommended Range |
|---------|-------------|---------|-------------------|
| `MaxConcurrency` | Number of blocks processed concurrently | 1 | 1-8 depending on CPU cores |
| `MaxItemsPerBatch` | Maximum items in a processing batch | 100 | 100-1000 depending on memory |
| `PollingIntervalMs` | Milliseconds between node polls | 1000 | 500-5000 depending on node type |
| `EnableDashboard` | Enables the monitoring dashboard | true | true for development |

## Troubleshooting

### Common Issues and Solutions

| Issue | Possible Causes | Solutions |
|-------|-----------------|-----------|
| **Connection Errors** | Incorrect connection string, firewall blocking access | Verify connection details, check network settings |
| **Authentication Failures** | Wrong database credentials | Update connection string with correct username/password |
| **Slow Synchronization** | Inefficient reducers, network latency | Optimize reducer code, consider local node connection |
| **Out of Memory Errors** | Processing too many items at once | Reduce batch size, increase server memory |
| **Database Locking** | Concurrent write operations | Implement proper transaction management |

### Logging and Diagnostics

Enable enhanced logging to troubleshoot issues:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Argus.Sync": "Debug",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  }
}
```

## Next Steps

Now that you have successfully installed and configured Argus, you can:

1. Implement [custom reducers](/docs/argus/reducers/general) for your specific use cases
2. Explore [advanced data models](/docs/argus/data-models) for blockchain data representation
3. Create [API endpoints](/docs/argus/api-integration) to expose your indexed data
4. Learn about [dApp integrations](/docs/argus/reducers/dapp) for popular Cardano applications

:::note
For more detailed documentation on specific topics, refer to the dedicated sections in the navigation menu.
:::

## Support Resources

If you encounter any issues during installation or have questions:

- Check the [GitHub repository](https://github.com/SAIB-Inc/Argus) for the latest updates
- Join our [Discord community](https://discord.gg/saib) for real-time assistance
- Report bugs and suggest features through [GitHub Issues](https://github.com/SAIB-Inc/Argus/issues)

---

Congratulations! You've successfully installed and configured Argus. You're now ready to build powerful blockchain data applications on Cardano.