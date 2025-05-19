---
title: Building Basic APIs Using Indexed Data
sidebar_position: 3 
description: Learn how to build basic APIs to access and serve Cardano data indexed by Argus.Sync, using Minimal API approaches primarily, with notes on controller-based alternatives and query optimization.
---

# 📄 Building Basic APIs: Unleashing Your Indexed Cardano Data

Welcome! This guide is your launchpad for transforming raw, Argus-indexed Cardano data into accessible and powerful APIs. Whether you're building front-end applications, supporting other services, or enabling third-party developers, these steps will help you serve your blockchain data efficiently and elegantly, with a primary focus on ASP.NET Core Minimal APIs.

## 🎯 Chapter 1: Laying the Groundwork - Introduction & Prerequisites

Before we dive into crafting APIs, let's ensure you're set up for success. Having your Argus.Sync environment configured and your data models defined is key to a smooth development process.

### Prerequisites Checklist ✅

* **An Active Argus.Sync Project**: Your .NET project should have Argus.Sync installed and configured.
  * For a complete walkthrough of setting up a new Argus project, including defining data models (`IReducerModel`), implementing a basic reducer, and configuring your `DbContext` (e.g., `MyDbContext`), please refer to our comprehensive [**Quick Start Guide**](../getting-started/quick-start.md).
  * For general setup information, see the [Setup Guides overview](./index.md).
* **Understanding of Reducers**: Familiarity with how reducers (custom or built-in) populate your database.
  * Explore the functionality of [**Built-in Reducers**](../usage-guides/builtin-reducers.md).
* **ASP.NET Core Web API Basics**: A working knowledge of creating API endpoints, particularly using Minimal API syntax for this guide's primary focus.
* **Database Fundamentals**: A basic understanding of database indexes will be beneficial for the optimization sections.

:::important Database Support
Currently, Argus.Sync exclusively supports **PostgreSQL** as its database backend. Ensure your environment and `DbContext` are configured accordingly.
:::

## 🛠️ Chapter 2: Architecting Your API - Step-by-Step Construction

Now, let's get to the exciting part: building the API endpoints! We'll primarily focus on the streamlined Minimal APIs approach in ASP.NET Core, with notes on the traditional controller-based method as an alternative.

### Architectural Crossroads: Separate API Project? 🤔

For larger or production-grade systems, consider creating your **API in a separate project** rather than directly within your Argus indexer project. This modular approach offers several advantages:

**Why a Separate API Project is Often Better:**

* 🎯 **Clearer Focus**: Keeps your indexer project dedicated to indexing and your API project dedicated to data exposure.
* ⚖️ **Independent Scaling**: Scale API instances and indexer instances independently based on their specific loads.
* 🚀 **Independent Deployments**: Update and deploy the API without impacting the indexer, and vice-versa.
* ⚙️ **Focused Dependencies**: API projects can have web-specific dependencies (e.g., Swagger) without bloating the indexer.
* 🧱 **Enhanced Security**: The API acts as a distinct security perimeter for data access.

**How This Modular Setup Works:**

1. **Shared Core Project**: A common project (referenced by both the indexer and API projects) would contain your `DbContext`, data models (`IReducerModel`), and any shared logic.
2. **Unified Database**: Both the Argus indexer and the API project connect to the same PostgreSQL database.

:::info A Note on This Guide's Examples
For simplicity, the examples in this guide demonstrate adding API endpoints as if they might be in the same project. However, the core principles apply universally. We strongly recommend a separate API project for production applications.
:::

### Method 1: Minimal APIs - Lean & Direct 🚀 (Primary Focus)

Minimal APIs offer a concise style, perfect for building focused and performant endpoints directly in your `Program.cs` or organized route files.

1. **Service Registration Check**:
    Ensure `IDbContextFactory<MyDbContext>` is registered in your `Program.cs`. This is typically handled by the Argus setup (e.g., `builder.Services.AddCardanoIndexer<MyDbContext>(...)`).

2. **Defining Endpoints in `Program.cs`**:
    Map HTTP requests directly to asynchronous lambda handlers.

    ```csharp
    // In Program.cs of your API Project (or Argus Project if combined)
    // var builder = WebApplication.CreateBuilder(args);
    // If in a separate API project, you'd register your DbContextFactory here:
    // builder.Services.AddDbContextFactory<MyDbContext>(options => 
    //     options.UseNpgsql(builder.Configuration.GetConnectionString("CardanoContext")));
    // Ensure your API project also has access to models and the Argus.Sync.Data namespace.

    // If combined with Argus project:
    // builder.Services.AddCardanoIndexer<MyDbContext>(builder.Configuration); 
    // builder.Services.AddReducers<MyDbContext, IReducerModel>(builder.Configuration);
    
    var app = builder.Build();

    // Group for API v1 (good practice for versioning)
    var apiV1 = app.MapGroup("/api/v1");

    // Example: Get latest blocks (assumes BlockBySlotReducer)
    apiV1.MapGet("/blocks/latest", async (
        IDbContextFactory<MyDbContext> dbFactory, 
        int? count) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var takeCount = count ?? 10; // Default to 10 if count is not provided
        var latestBlocks = await dbContext.BlocksBySlot // Assuming BlocksBySlot DbSet from BlockBySlotReducer
            .OrderByDescending(b => b.Slot)
            .Take(takeCount)
            .ToListAsync();
        return Results.Ok(latestBlocks);
    })
    .WithName("GetLatestBlocks") 
    .WithTags("Blocks API");    

    // Example: Get block by slot (assumes BlockBySlotReducer)
    apiV1.MapGet("/block/{slot:ulong}", async ( 
        ulong slot, 
        IDbContextFactory<MyDbContext> dbFactory) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var block = await dbContext.BlocksBySlot
            .AsNoTracking() 
            .FirstOrDefaultAsync(b => b.Slot == slot);

        return block is null 
            ? Results.NotFound($"Block with slot {slot} not found.") 
            : Results.Ok(block);
    })
    .WithName("GetBlockBySlot")
    .WithTags("Blocks API");
    
    // app.Run();
    ```

    :::note Organizing Minimal APIs
    For larger applications, consider grouping related Minimal API endpoints using `RouteGroupBuilder` as shown above to keep `Program.cs` clean, or they may use Carter module or FastEndpoints for more advanced modularity.
    :::

### Method 2: The Controller-Based Approach 🏛️ (Alternative)

While our focus is Minimal APIs, the classic controller approach is still perfectly valid and often preferred for complex APIs with many actions or when more traditional OO structure is desired.

1. **Crafting Your API Controller**:
    In your API project (or Argus project if combined), create a C# class in a `Controllers` folder (e.g., `CardanoDataController.cs`).

    ```csharp
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    // Update with your project's namespace and DbContext
    // This usually comes from a shared data/models project
    using YourSharedDataProject.Data; 
    using YourSharedDataProject.Models; // Or wherever your models like BlocksBySlot reside

    namespace YourApiProject.Controllers 
    {
        [ApiController]
        [Route("api/v1/controller/[controller]")] // Example route
        public class CardanoDataController : ControllerBase
        {
            private readonly IDbContextFactory<MyDbContext> _dbContextFactory;

            public CardanoDataController(IDbContextFactory<MyDbContext> dbContextFactory)
            {
                _dbContextFactory = dbContextFactory;
            }

            // Example: Get latest blocks (controller version)
            [HttpGet("blocks/latest")]
            public async Task<IActionResult> GetLatestBlocks([FromQuery] int count = 10)
            {
                await using var dbContext = await _dbContextFactory.CreateDbContextAsync();
                var latestBlocks = await dbContext.BlocksBySlot // Assuming BlocksBySlot is accessible
                    .OrderByDescending(b => b.Slot) 
                    .Take(count)
                    .ToListAsync();
                return Ok(latestBlocks);
            }
        }
    }
    ```

2. **Ensuring `DbContextFactory` Registration**:
    This step is the same as for Minimal APIs; the `DbContextFactory` needs to be available via dependency injection in your API project's `Program.cs`.

## 💡 Chapter 3: Showcasing Your Data - Minimal API Examples & Use Cases

Let's bring your indexed data to life with practical Minimal API examples. The core logic for querying data remains similar regardless of the API style, but the endpoint definition differs.

### Example 1: Fetching a Specific Block 🧱

* **Relevant Reducer**: `BlockBySlotReducer`
* **Why it's Fast**: `Slot` is often a primary key or uniquely indexed.
* **Minimal API Endpoint (within `apiV1` group in `Program.cs`)**:

    ```csharp
    apiV1.MapGet("/block-details/{slot:ulong}", async (ulong slot, IDbContextFactory<MyDbContext> dbFactory) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var block = await dbContext.BlocksBySlot // From BlockBySlotReducer
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Slot == slot);
        
        return block is null 
            ? Results.NotFound($"Block with slot {slot} not found.") 
            : Results.Ok(block);
    })
    .WithName("GetBlockDetails")
    .WithTags("Blocks API");
    ```

### Example 2: Retrieving Account Balances 💰

* **Relevant Reducer**: `BalanceByAddressReducer`
* **Why it's Fast**: `Address` is the primary key for the `BalanceByAddress` table.
* **Minimal API Endpoint (within `apiV1` group in `Program.cs`)**:

    ```csharp
    apiV1.MapGet("/account/balance/{address}", async (string address, IDbContextFactory<MyDbContext> dbFactory) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var balance = await dbContext.BalanceByAddress // From BalanceByAddressReducer
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Address == address);

        if (balance == null) 
        {
            return Results.NotFound($"Balance data not found for address {address}.");
        }
        // Consider creating a DTO for a cleaner response
        return Results.Ok(new {
            balance.Address,
            balance.Lovelace,
            Assets = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, ulong>>(balance.Assets ?? "{}"), 
            balance.UpdatedAtSlot
        });
    })
    .WithName("GetAccountBalance")
    .WithTags("Accounts API");
    ```

### Example 3: Listing UTXOs for an Address 🪙

* **Relevant Reducer**: `UtxoByAddressReducer` or a similar custom implementation.
* **Performance Tip**: Ensure your `UtxoDataModel` (or equivalent if custom) table is indexed on the `Address` column. `UtxoByAddressReducer` itself does not store queryable UTXO content, but tracks UTXO references. You'd typically have another reducer for full UTXO details. For this example, assume `DetailedUtxoRecord` is such a model from a shared data project.
* **Minimal API Endpoint (within `apiV1` group in `Program.cs`)**:

    ```csharp
    // Assuming a custom model 'DetailedUtxoRecord' and a DbSet for it
    // This would require a custom reducer to populate 'DetailedUtxoRecords'
    apiV1.MapGet("/account/utxos/{address}", async (string address, IDbContextFactory<MyDbContext> dbFactory) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var utxos = await dbContext.Set<DetailedUtxoRecord>() // Replace with your actual Utxo model
            .AsNoTracking()
            .Where(u => u.Address == address) 
            .OrderByDescending(u => u.Slot) 
            .ToListAsync();
        
        return !utxos.Any()
            ? Results.NotFound("No UTXOs found for this address.")
            : Results.Ok(utxos);
    })
    .WithName("GetAccountUtxos")
    .WithTags("Accounts API");
    ```

### Example 4: Querying DEX Token Prices (e.g., SundaeSwap) 📈

* **Relevant Reducer**: `SundaePriceByTokenReducer`
* **Why it's Fast**: The underlying table uses a composite primary key ideal for these lookups.
* **Minimal API Endpoint (within `apiV1` group in `Program.cs`)**:

    ```csharp
    apiV1.MapGet("/dex/price/sundae", async (
        [FromQuery] string tokenASubject, 
        [FromQuery] string tokenBSubject,
        IDbContextFactory<MyDbContext> dbFactory) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var latestPrice = await dbContext.Set<SundaePriceByToken>() // From SundaePriceByTokenReducer
            .AsNoTracking()
            .Where(p => (p.TokenXSubject == tokenASubject && p.TokenYSubject == tokenBSubject) ||
                         (p.TokenXSubject == tokenBSubject && p.TokenYSubject == tokenASubject))
            .OrderByDescending(p => p.Slot)
            .FirstOrDefaultAsync();

        return latestPrice == null
            ? Results.NotFound($"Price data not found for pair {tokenASubject}/{tokenBSubject}.")
            : Results.Ok(latestPrice);
    })
    .WithName("GetSundaeSwapPrice")
    .WithTags("DEX API");
    ```

## ✨ Chapter 4: Mastering Your Craft - API Best Practices

Building functional APIs is one thing; building *great* APIs is another. Let's explore practices to elevate your API design and implementation. Many of these are also discussed in our [Applications Guide](./applications.md#-best-practices-for-integrating-argus).

### Navigating Large Datasets: Pagination 📚

Always paginate endpoints that might return numerous items. This prevents overwhelming clients and your server.

* **Technique**: Use `Skip()` and `Take()` in LINQ.
* **Parameters**: Accept `pageNumber` and `pageSize`.
* **Response**: Include metadata like `totalCount`, `pageSize`, `pageNumber`, `totalPages`.

    ```csharp
    // Minimal API Example for paginating blocks
    apiV1.MapGet("/blocks", async (
        IDbContextFactory<MyDbContext> dbFactory,
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 20) =>
    {
        // Add validation for pageNumber and pageSize (e.g., > 0, max pageSize)
        if (pageNumber <= 0) pageNumber = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 20; // Example max page size

        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var totalCount = await dbContext.BlocksBySlot.CountAsync(); // From BlockBySlotReducer
        var blocks = await dbContext.BlocksBySlot
            .OrderByDescending(b => b.Slot)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Results.Ok(new {
            TotalItems = totalCount,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            Items = blocks
        });
    })
    .WithName("GetPaginatedBlocks")
    .WithTags("Blocks API");
    ```

### Refining Results: Filtering and Sorting 🔍

Empower clients to request precisely what they need.

* **Filtering**: Use optional query parameters for relevant fields (e.g., `?status=confirmed`).
* **Sorting**: Accept `sortBy` and `sortDirection` (e.g., `?sortBy=slot&sortDirection=desc`).

### Consistent by Design: Response Structure 📐

Adopt a uniform JSON structure for all responses, especially errors. This predictability greatly improves the developer experience for API consumers. While ASP.NET Core provides built-in mechanisms like `Results` (for Minimal APIs) and `ActionResult` subtypes (for controllers) that map directly to HTTP status codes, many robust APIs benefit from a **custom standardized response wrapper**. This wrapper would consistently contain fields like a boolean `success` flag, a `data` payload (for successful responses), and an `error` object (for failures), alongside any other relevant metadata like timestamps or trace IDs.

### Graceful Degradation: Error Handling 🛡️

Employ standard HTTP status codes to signal outcomes.

* `200 OK`, `201 Created`
* `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
* `500 Internal Server Error`

:::tip Custom vs. Built-in Responses
ASP.NET Core's built-in `Results` (Minimal APIs) and `ActionResults` (controllers) are ideal for setting correct HTTP status codes. However, for a superior developer experience, consider pairing them with a **custom response wrapper** (see "Consistent by Design"). This wrapper ensures a consistent response body structure for data and errors, making client-side parsing more reliable, while standard HTTP status codes still convey the overall outcome.
:::

### Versioning for Evolution: API Versioning 🛣️

Plan for future changes by versioning your API from day one (e.g., `/api/v1/...` as shown in examples). This allows you to introduce breaking changes without disrupting existing integrations.

### Optimizing Delivery: Caching Strategies ⚡

Cache frequently accessed, rarely changing data to reduce database load and boost response times. ASP.NET Core offers tools like response caching middleware and `IMemoryCache`.

### Asynchronous All the Way: Async Operations 🔄

Use `async` and `await` for all I/O-bound operations (like database calls) to ensure your API remains responsive under load.

### Fortifying Your Endpoints: Security Measures 🔒

* **Authentication & Authorization**: Protect sensitive data and operations.
* **Input Validation**: Rigorously validate all client-supplied data.
* **Rate Limiting**: Prevent abuse and ensure fair usage.
* **HTTPS**: Always use HTTPS in production.

### Optimizing the Core: Database Query Performance 🚀

The speed of your API is directly tied to how efficiently you query your database.

* **The Power of Indexing**:
  * **Identify Key Columns**: Index columns frequently used in `WHERE` clauses, `JOIN`s, and `ORDER BY` statements. Common candidates include `Address`, `Slot`, `TxHash`, `PolicyId`, and `AssetName`.
  * **Argus's Head Start**: Many built-in Argus reducers establish indexed primary keys (e.g., `Address` for `BalanceByAddressReducer`, `Slot` for `BlockBySlotReducer`). DApp-specific reducers often use composite keys that facilitate efficient querying.
  * **Crafting Custom Indexes**: For your unique data models (`IReducerModel`), define necessary indexes within your `DbContext`'s `OnModelCreating` method. For detailed guidance, see our [Efficient Database Design in the Applications Guide](./applications.md#-efficient-database-design).

    ```csharp
    // Inside YourDbContext.cs (potentially in a shared data project)
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // Crucial for CardanoDbContext base configurations

        // Example for a custom 'WalletTransaction' model
        modelBuilder.Entity<WalletTransaction>(entity =>
        {
            // Define a primary key if not already done
            // entity.HasKey(e => new { e.TxHash, e.SomeIndex }); 

            entity.HasIndex(e => e.Address)
                    .HasDatabaseName("IX_WalletTransaction_Address"); 

            entity.HasIndex(e => e.Slot)
                    .HasDatabaseName("IX_WalletTransaction_Slot");

            // Composite index for queries filtering by both Address and Slot
            entity.HasIndex(e => new { e.Address, e.Slot })
                    .HasDatabaseName("IX_WalletTransaction_Address_Slot");
        });
    }
    ```

  * **Don't Forget Migrations!** After defining new indexes, create and apply them:
        `dotnet ef migrations add EnhanceQueryPerformanceWithIndexes`
        `dotnet ef database update`

* **Writing Smart LINQ Queries**:
  * **Precision with `.Select()`**: Fetch only the columns your API endpoint actually needs. Avoid over-fetching.

    ```csharp
    var essentialBlockData = await dbContext.BlocksBySlot // From BlockBySlotReducer
        .OrderByDescending(b => b.Slot)
        .Take(10)
        .Select(b => new { BlockSlot = b.Slot, BlockHash = b.Hash }) 
        .ToListAsync();
    ```

  * **Read-Only Efficiency with `.AsNoTracking()`**: For queries that don't modify data, `AsNoTracking()` tells Entity Framework Core to bypass change tracking, often speeding things up.

    ```csharp
    var block = await dbContext.BlocksBySlot // From BlockBySlotReducer
        .AsNoTracking() // Perfect for GET requests
        .FirstOrDefaultAsync(b => b.Slot == slot);
    ```

  * **Database-Side Filtering**: Ensure `WHERE` clauses are applied early to minimize data transfer.
  * **Avoiding N+1 Pitfalls**: Be cautious with related data. Use projections (`Select` with new anonymous or DTO types) or, if necessary, `Include()`/`ThenInclude()` judiciously for eager loading.

* **Continuous Improvement: Analysis & Monitoring**:
  * **EF Core Logging**: Enable logging to see the exact SQL queries EF Core generates. This is invaluable for debugging.
  * **Database Execution Plans**: For persistent slow queries, analyze their execution plans using your database's native tools. This can reveal missing indexes or inefficient operations.

:::important Query Optimization is Key
Thoughtful indexing and efficient query patterns are fundamental to a high-performance, scalable API backed by Argus-indexed data.
:::

## 🚀 Chapter 5: Beyond the Basics - Conclusion & Next Steps

You've now journeyed through building APIs on your Argus-indexed Cardano data, covering both Minimal API and controller-based styles, along with essential best practices for robust and performant services.

The true power of Argus lies in its ability to structure complex blockchain data into a queryable format. By exposing this data through well-designed APIs, you unlock countless possibilities for your applications and users.

**What's Next?** 🧭

* **Deep Dive into Reducers**: Explore more [Built-in Reducers](../usage-guides/builtin-reducers.md) or create complex custom reducers for highly specific data needs.
* **Advanced API Features**: Implement features like WebSockets for real-time updates, GraphQL for flexible data querying, or HATEOAS for discoverable APIs.
* **Testing**: Thoroughly test your API endpoints, including load testing, to ensure reliability.
* **Documentation**: Use tools like Swagger/OpenAPI (which integrates well with ASP.NET Core) to generate interactive API documentation for your consumers.

Happy building, and may your APIs be fast, reliable, and a joy to use! 🎉
