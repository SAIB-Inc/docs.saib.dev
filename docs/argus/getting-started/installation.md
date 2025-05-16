---
title: Installation
sidebar_position: 2
---

# Installation Guide

---

This guide will walk you through installing Argus and setting up the required dependencies for your .NET project.

## 📋 Prerequisites

Before installing Argus, make sure you have the following prerequisites:

* 🔷 **.NET 9.0 SDK** or later installed
* 🐘 **PostgreSQL** database server (version 12 or higher)
* 🧰 Basic knowledge of C# and Entity Framework

:::tip
Argus is designed to work with PostgreSQL, but plans for additional database backends are in development.
:::

---

## 📦 Installing Argus

### 1. Add the NuGet Package

The simplest way to install Argus is via the NuGet package manager:

```bash
dotnet add package Argus.Sync --version 0.3.1-alpha
```

Or add it through the Package Manager Console:

```powershell
Install-Package Argus.Sync -Version 0.3.1-alpha
```

You can also add it through the Visual Studio NuGet Package Manager by searching for "Argus.Sync".

### 2. Install Required Dependencies

Argus requires Entity Framework Core for database operations. Install the necessary packages:

```bash
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

---

## 🗄️ Database Setup

### 1. Create a PostgreSQL Database

First, create a PostgreSQL database for your Argus data. You can use the PostgreSQL command line or a GUI tool like pgAdmin.

```bash
createdb argus_db
```

### 2. Configure Connection String

In your `appsettings.json` file, add the database connection details:

```json
{
  "ConnectionStrings": {
    "CardanoContext": "Host=localhost;Database=argus_db;Username=postgres;Password=your_password;Port=5432",
    "CardanoContextSchema": "public"
  }
}
```

:::info Configuration Options
- `Host`: Your PostgreSQL server hostname or IP address
- `Database`: The name of your PostgreSQL database
- `Username`: PostgreSQL user with permissions to create tables
- `Password`: The user's password
- `Port`: PostgreSQL server port (default is 5432)
- `CardanoContextSchema`: The schema name to use (default is "public")
:::

---

## ⚙️ Initial Configuration

### Basic Node Connection

Add the connection details for your Cardano node in `appsettings.json`:

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

:::info Node Connection Options
- `ConnectionType`: Choose "UnixSocket" for local node or "gRPC" for remote node service
- `gRPC`: Configuration for gRPC connection (if using gRPC)
- `UnixSocket`: Configuration for Unix socket connection (if using Unix socket)
- `NetworkMagic`: Network magic number (2 for Preview, 1 for PreProd, 764824073 for Mainnet)
- `Slot` & `Hash`: Starting point for synchronization
:::

:::warning
For production use, consider using environment variables or a secure secret management solution instead of hardcoding sensitive values like API keys in configuration files.
:::

---

## 🔄 Creating a DbContext

Create a database context class that inherits from `CardanoDbContext`:

```csharp
using Argus.Sync.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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

    // DbSet properties and OnModelCreating override will be added later
}
```

---

## 🚀 Registering Services

In your `Program.cs` or startup code, register Argus services:

```csharp
// Add Argus to the dependency injection container
builder.Services.AddCardanoIndexer<MyDbContext>(builder.Configuration);

// Register reducers (you'll add your own reducers later)
builder.Services.AddReducers<MyDbContext, IReducerModel>([/* your reducers here */]);
```

---

## ✅ Verification

To verify that Argus is installed correctly:

1. 🔍 Make sure you can build your project without errors:

```bash
dotnet build
```

2. 🧪 Create a simple reducer and run your application:

```bash
dotnet run
```

3. 📊 If the application starts and connects to your Cardano node without errors, Argus is installed correctly!

:::tip
You can check the database to see if the `ReducerStates` table has been created, which indicates a successful connection.
:::

---

## 🔍 Troubleshooting

If you encounter issues during installation:

* 🔗 **Connection Issues**: Verify that your PostgreSQL connection string is correct
* 🚫 **Access Denied**: Ensure your database user has sufficient permissions
* 📦 **Package Conflicts**: Check for version conflicts with other installed packages
* 🧩 **Missing Dependencies**: Ensure all required dependencies are installed

For more detailed error resolution, check the [Troubleshooting Guide](../guides/troubleshooting.md).

---

## 📚 Next Steps

Now that you have Argus installed, you're ready to:

1. 🏃 Follow the [Quick Start Guide](quick-start.md) to create your first reducer
2. ⚙️ Learn more about [Configuration Options](configuration.md)
3. 🏗️ Understand the [Architecture Overview](architecture-overview.md)

---

Congratulations! You've successfully installed Argus. Let's move on to building your first blockchain indexer.