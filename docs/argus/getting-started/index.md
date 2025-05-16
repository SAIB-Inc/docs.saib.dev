---
title: Introduction
sidebar_position: 1
hide_title: true
---
  
![Argus logo](/img/argus.png)

---

Welcome to the Argus documentation! This guide will help you understand and use Argus to build powerful Cardano blockchain applications with .NET.

&nbsp;

:::tip
Watch the [5-minute introduction video](https://x.com/clarkalesna/status/1859042521856532883) to get a quick overview of Argus and see it in action!
:::

## 🔍 What is Argus?

Argus is a modern .NET library that brings the Cardano blockchain to your fingertips. It serves as an efficient indexing framework that transforms complex blockchain data into structured, queryable formats in your database.

Think of Argus as your bridge between the raw Cardano blockchain and your application:

```
┌────────────────┐     ┌─────────────┐     ┌────────────────┐
│                │     │             │     │                │
│ Cardano        │────▶│    Argus    │────▶│   Database     │
│ Blockchain     │     │  (Indexer)  │     │  (PostgreSQL)  │
│                │     │             │     │                │
└────────────────┘     └─────────────┘     └────────────────┘
       Raw Data          Processing          Structured Data
```

---

## ✨ Why Use Argus?

Argus stands out as a Cardano indexer built specifically for .NET developers:

* 🧰 **Familiar Development Experience**  
  Work with blockchain data using C# and .NET tools like LINQ, Entity Framework, and ASP.NET

* 🎯 **Focused Data Processing**  
  Extract only the data your application needs through customizable reducers

* 🏢 **Enterprise-Ready**  
  Built with reliability, performance, and scalability for production environments

* 🔄 **Simplified Blockchain Access**  
  Abstract away complex blockchain protocols and data formats

* ⚡ **Real-time Data**  
  Stay synchronized with the blockchain through efficient chain synchronization

---

## 🧩 Key Features

Argus combines power and simplicity to make blockchain development accessible:

* 🔧 **Customizable Reducers**  
  Define exactly what blockchain data to extract and how to process it

* 🔌 **Flexible Connectivity**  
  Connect to Cardano nodes via Unix Socket or gRPC

* 🔁 **Robust Rollback Handling**  
  Maintain data consistency during chain reorganizations

* 📊 **Comprehensive Monitoring**  
  Real-time visibility into the indexing process

* 🗄️ **Entity Framework Integration**  
  Leverage familiar ORM tools for database operations

* 🛡️ **Production-Ready**  
  Designed for reliability in enterprise applications

---

## ⚙️ How Argus Works

Argus follows a straightforward yet powerful pattern to process blockchain data:

1. 🔗 **Connect** to a Cardano node using one of the available providers
2. 🔄 **Sync** with the blockchain to receive blocks in real-time
3. 🔍 **Process** blocks through your custom reducers to extract and transform data
4. 💾 **Store** the processed data in your database for easy querying
5. 🛡️ **Handle** chain reorganizations automatically to maintain data consistency

The heart of Argus is the reducer pattern, which gives you full control over data processing:

&nbsp;

```csharp
public class BlockReducer : IReducer<BlockInfo>
{
    public async Task RollForwardAsync(Block block)
    {
        // Extract data from the block
        string hash = block.Header().Hash();
        ulong slot = block.Header().HeaderBody().Slot();
        
        // Store it in your database
        using var db = dbContextFactory.CreateDbContext();
        db.Blocks.Add(new BlockInfo(hash, slot, DateTime.UtcNow));
        await db.SaveChangesAsync();
    }

    public async Task RollBackwardAsync(ulong slot)
    {
        // Handle rollbacks when chain reorganizations occur
        using var db = dbContextFactory.CreateDbContext();
        db.Blocks.RemoveRange(db.Blocks.Where(b => b.Slot >= slot));
        await db.SaveChangesAsync();
    }
}
```

---

## 🚀 Getting Started

Ready to start using Argus? Here's how to get up and running quickly:

&nbsp;

:::info Try it now
The fastest way to get started with Argus is to install the NuGet package:

```bash
dotnet add package Argus.Sync
```
:::

Follow these guides to dive deeper:

1. 📥 [Installation](installation.md) - How to add Argus to your .NET project
2. ⏱️ [Quick Start](quick-start.md) - Build your first indexer in 5 minutes
3. ⚙️ [Configuration](configuration.md) - Configure Argus for your specific needs
4. 🏗️ [Architecture Overview](architecture-overview.md) - Understand how Argus works

---



## 🛠️ What Can You Build with Argus?

Argus enables a wide range of Cardano blockchain applications:

* 📈 **DeFi Dashboards**  
  Track liquidity pools, trading volumes, and token prices

* 🖼️ **NFT Marketplaces**  
  Monitor NFT ownership, sales, and listings

* 💼 **Wallet Services**  
  Build wallet tracking and analytics tools

* 📝 **Smart Contract Monitoring**  
  Watch for specific contract interactions

* 📊 **Custom Blockchain Analytics**  
  Create specialized metrics and reports

---

## 🌟 Key Differentiators

What makes Argus stand out from other blockchain indexers:

* 🔷 **Native .NET Integration** - Built from the ground up for .NET, not a wrapper around other tools
* ⚡ **Performance Focused** - Optimized for high-throughput blockchain data processing
* 🧩 **Flexible Deployment** - Run as part of your application or as a standalone service
* 💻 **Developer Experience** - Designed with .NET developers in mind, using familiar patterns and tools

:::warning
Argus is currently in active development (version 0.3.1-alpha). While ready for many use cases, expect ongoing enhancements and improvements.
:::

---

## 👥 Community and Support

Connect with the Argus community and get help:

* 📂 **GitHub**: [Argus Repository](https://github.com/SAIB-Inc/Argus)
* 📦 **NuGet**: [Argus.Sync Package](https://www.nuget.org/packages/Argus.Sync)
* 🎬 **Video Tutorial**: [Introduction to Argus](https://x.com/clarkalesna/status/1859042521856532883)

---

## 📚 Documentation Structure

This documentation is organized to help you learn and use Argus effectively:

* 🚀 **Getting Started** - Installation and basic setup
* 🧠 **Core Concepts** - Fundamental ideas behind Argus
* 📝 **Guides** - Step-by-step tutorials for common tasks
* 🔌 **Connections** - How to connect to the Cardano blockchain
* 🧩 **Data Models** - Understanding Cardano data structures
* 🔄 **Reducers** - Building and using reducers
* 🌐 **API Integration** - Using indexed data in APIs
* 📘 **Reference** - Detailed technical information

---

Ready to dive in? Start with the [Installation Guide](installation.md) to set up Argus in your project.