---
title: Quick Start
sidebar_position: 3
---

# Build Your First Indexer in 5 Minutes

---

This quick start guide will help you build a simple yet functional Cardano blockchain indexer using Argus. By the end, you'll have an application that stores basic block information from the Cardano blockchain.

&nbsp;

:::tip
Make sure you've completed the [Installation](installation.md) steps before proceeding with this guide.
:::

---

## 🎯 What We'll Build

We'll create a simple indexer that:

1. 🔄 Connects to the Cardano blockchain
2. 📦 Tracks basic block information (hash, slot, timestamp)
3. 💾 Stores this data in a PostgreSQL database
4. 🛡️ Handles chain reorganizations correctly


---

## 📂 Project Structure

Here's what your project structure will look like:

```
MyCardanoIndexer/
├── Program.cs             # Main entry point
├── Models/
│   └── BlockInfo.cs       # Model for block data
├── Data/
│   └── AppDbContext.cs    # Database context
├── Reducers/
│   └── BlockReducer.cs    # Our first reducer
└── appsettings.json       # Configuration file
```

---

## 🚀 Step 1: Create a New .NET Project

Start by creating a new ASP.NET Core Web API project:

```bash
dotnet new webapi -n MyCardanoIndexer
cd MyCardanoIndexer
```

Add the required NuGet packages:

```bash
dotnet add package Argus.Sync --version 0.3.1-alpha
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

---

## 🧱 Step 2: Create the Model

Create a model to represent block data:

```csharp
// Models/BlockInfo.cs
using Argus.Sync.Data.Models;

namespace MyCardanoIndexer.Models;

public record BlockInfo(
    string Hash,       // Block hash (unique identifier)
    ulong Slot,        // Slot number
    ulong Number,      // Block number
    DateTime TimeStamp // When block was processed
) : IReducerModel;
```

:::info
The `IReducerModel` interface marks this class as a model that can be used with Argus reducers.
:::

---

## 🗄️ Step 3: Create the Database Context

Create a database context to manage the database connection:

&nbsp;

```csharp
// Data/AppDbContext.cs
using Argus.Sync.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MyCardanoIndexer.Models;

namespace MyCardanoIndexer.Data;

// Define the interface for our DB context
public interface IAppDbContext
{
    DbSet<BlockInfo> Blocks { get; }
}

// Implement our database context
public class AppDbContext : CardanoDbContext, IAppDbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options,
        IConfiguration configuration
    ) : base(options, configuration)
    {
    }

    // Define the Blocks table
    public DbSet<BlockInfo> Blocks => Set<BlockInfo>();

    // Configure the entity
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BlockInfo>(entity =>
        {
            entity.HasKey(e => e.Hash);
            entity.Property(e => e.TimeStamp)
                  .HasDefaultValueSql("now()");
        });
    }
}
```

---

## 🔄 Step 4: Create a Reducer

Create your first reducer to process blocks:

&nbsp;

```csharp
// Reducers/BlockReducer.cs
using Argus.Sync.Reducers;
using Chrysalis.Cbor.Extensions.Cardano.Core;
using Chrysalis.Cbor.Extensions.Cardano.Core.Header;
using Microsoft.EntityFrameworkCore;
using MyCardanoIndexer.Data;
using MyCardanoIndexer.Models;
using Block = Chrysalis.Cbor.Types.Cardano.Core.Block;

namespace MyCardanoIndexer.Reducers;

public class BlockReducer : IReducer<BlockInfo>
{
    private readonly IDbContextFactory<AppDbContext> _dbContextFactory;

    public BlockReducer(IDbContextFactory<AppDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    // Process new blocks
    public async Task RollForwardAsync(Block block)
    {
        // Extract block data using the Chrysalis extensions
        string hash = block.Header().Hash();
        ulong slot = block.Header().HeaderBody().Slot();
        ulong number = block.Header().HeaderBody().BlockNumber();
        
        // Create a new BlockInfo record
        var blockInfo = new BlockInfo(
            Hash: hash,
            Slot: slot,
            Number: number,
            TimeStamp: DateTime.UtcNow
        );

        // Store it in the database
        using var db = _dbContextFactory.CreateDbContext();
        db.Blocks.Add(blockInfo);
        await db.SaveChangesAsync();
    }

    // Handle chain reorganizations
    public async Task RollBackwardAsync(ulong slot)
    {
        using var db = _dbContextFactory.CreateDbContext();
        
        // Remove any blocks at or after the rollback slot
        db.Blocks.RemoveRange(
            db.Blocks.Where(b => b.Slot >= slot)
        );
        
        await db.SaveChangesAsync();
    }
}
```

---

## ⚙️ Step 5: Configure Your Application

Update your `appsettings.json` file:

&nbsp;

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=cardano_indexer;Username=postgres;Password=your_password;Port=5432",
    "CardanoContextSchema": "public"
  },
  "CardanoNodeConnection": {
    "ConnectionType": "gRPC",
    "gRPC": {
      "Endpoint": "https://cardano-preview.utxorpc-m1.demeter.run",
      "ApiKey": "your_api_key"
    },
    "NetworkMagic": 2,
    "Slot": 64239299,
    "Hash": "e3a57544f2140c014691644a90021d0af36b2c6a1ef4bad713891e17dea90cae"
  },
  "Sync": {
    "Dashboard": {
      "TuiMode": true,
      "RefreshInterval": 5000,
      "DisplayType": "full"
    }
  }
}
```

:::warning
Replace `your_password` with your actual PostgreSQL password and `your_api_key` with your Demeter API key if you're using that service.
:::

---

## 🔌 Step 6: Register Services

Update `Program.cs` to register Argus services:

&nbsp;

```csharp
using Microsoft.EntityFrameworkCore;
using MyCardanoIndexer.Data;
using MyCardanoIndexer.Models;
using MyCardanoIndexer.Reducers;
using Argus.Sync.Data.Models;
using Argus.Sync.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add controllers and API explorer
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add database context
builder.Services.AddDbContextFactory<AppDbContext>((serviceProvider, options) =>
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

// Register Argus services
builder.Services.AddCardanoIndexer<AppDbContext>(builder.Configuration);
builder.Services.AddReducers<AppDbContext, IReducerModel>([typeof(BlockReducer)]);

var app = builder.Build();

// Configure the HTTP request pipeline
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

---

## 📝 Step 7: Create and Apply Migrations

Generate an Entity Framework migration:

&nbsp;

```bash
dotnet ef migrations add InitialCreate
```

Apply the migration to create your database schema:

&nbsp;

```bash
dotnet ef database update
```

---

## 🚀 Step 8: Run Your Application

Start your application:

&nbsp;


```bash
dotnet run
```

Your application will connect to the Cardano blockchain and start indexing blocks!

---

## 📊 Step 9: View Your Data

You can now query your database to see the indexed blocks

&nbsp;

```sql
SELECT * FROM "Blocks" ORDER BY "Slot" DESC LIMIT 10;
```

This should return the most recent blocks that have been indexed

---

## 🔍 What's Happening?

Let's break down what's happening in your application:

1. 🔌 **Cardano Connection**: Argus connects to the Cardano node using the configured provider
2. 🔄 **Chain Sync**: The indexer synchronizes with the blockchain, starting from the configured slot
3. 📦 **Block Processing**: Each block is passed to your `BlockReducer.RollForwardAsync` method
4. 💾 **Data Storage**: Block information is stored in your PostgreSQL database
5. ⚠️ **Rollback Handling**: If a chain reorganization occurs, your `RollBackwardAsync` method is called

---

## 🚶 Next Steps

Now that you have a basic indexer running, you can:

1. 🔍 Add more reducers to extract additional data (transactions, addresses, tokens)
2. 🌐 Build an API on top of your indexed data
3. 📊 Create more complex queries for specific blockchain insights
4. 🔗 Connect to the Cardano mainnet for production use

Check out these guides for more advanced topics:

- [Creating Custom Reducers](../guides/create-custom-reducer.md)
- [Setting Up a Production Environment](../guides/deploy-production.md)
- [Working with Smart Contracts](../reducers/dapp/index.md)

---

Congratulations! You've built your first Cardano blockchain indexer with Argus. You're now ready to explore more advanced features and build powerful blockchain applications.


