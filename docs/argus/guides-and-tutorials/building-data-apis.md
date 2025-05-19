---
title: Building Data APIs
sidebar_position: 3 
description: Learn how to build effective APIs to access and serve Cardano data indexed by Argus.Sync, focusing on Minimal APIs, controller alternatives, DTOs, and query optimization.
---

# 📄 Building Data APIs

Welcome! This guide is your launchpad for transforming raw, Argus-indexed Cardano data into accessible and powerful APIs. Whether you're building front-end applications, supporting other services, or enabling third-party developers, these steps will help you serve your blockchain data efficiently and elegantly, with a primary focus on ASP.NET Core Minimal APIs.

## 🎯 Introduction & Prerequisites

Before crafting APIs, ensure your Argus.Sync environment is configured and your data models are defined. This foundation is key to a smooth development process.

### Prerequisites Checklist

* **An Active Argus.Sync Project**: Your .NET project should have Argus.Sync installed and configured.
  * For a complete walkthrough of setting up a new Argus project—including defining data models (`IReducerModel`), implementing a basic reducer, and configuring your `DbContext` (e.g., `MyDbContext`)—please refer to our comprehensive [**Quick Start Guide**](../getting-started/quick-start.md).
  * For general setup information, see the [Setup Guides overview](./index.md).
* **Understanding of Reducers**: Familiarity with how reducers (custom or built-in) populate your database.
  * Explore the functionality of [**Built-in Reducers**](../usage-guides/builtin-reducers.md).
* **ASP.NET Core Web API Basics**: A working knowledge of creating API endpoints, particularly using Minimal API syntax for this guide's primary focus.
* **Database Fundamentals**: A basic understanding of database indexes will be beneficial for the optimization sections.

:::important Database Support
Currently, Argus.Sync exclusively supports **PostgreSQL** as its database backend. Ensure your environment and `DbContext` are configured accordingly.
:::

## 🛠️ Step-by-Step API Construction

Let's build the API endpoints! We'll focus on the streamlined Minimal APIs approach, noting controller-based methods as alternatives.

### Architectural Crossroads: Separate API Project?

For larger or production-grade systems, consider creating your **API in a separate project** rather than directly within your Argus indexer project. This modular approach offers several advantages:

**Why a Separate API Project is Often Better:**

* **Clearer Focus**: Keeps your indexer project dedicated to indexing and your API project dedicated to data exposure.
* **Independent Scaling**: Scale API instances and indexer instances independently based on their specific loads.
* **Independent Deployments**: Update and deploy the API without impacting the indexer, and vice-versa.
* **Focused Dependencies**: API projects can have web-specific dependencies (e.g., Swagger) without bloating the indexer.
* **Enhanced Security**: The API acts as a distinct security perimeter for data access.

**How This Modular Setup Works:**

1. **Shared Core Project (Class Library)**: A common class library project, referenced by both the indexer and API projects, would contain your `DbContext`, data models (`IReducerModel`), DTOs, and any shared logic or services.
2. **Unified Database**: Both the Argus indexer and the API project connect to the same PostgreSQL database.

:::info A Note on This Guide's Examples
For simplicity, the examples in this guide demonstrate adding API endpoints as if they might be in the same project. However, the core principles apply universally. We strongly recommend a separate API project for production applications.
:::

### Method 1: Minimal APIs - Lean & Direct

Minimal APIs offer a concise style for building focused endpoints directly in your `Program.cs` or organized route files.

1. **Service Registration Check**:
    Ensure `IDbContextFactory<MyDbContext>` is registered in your `Program.cs` (typically handled by Argus setup).

2. **Defining Endpoints in `Program.cs`**:
    Map HTTP requests directly to asynchronous lambda handlers.

    ```csharp
    // In Program.cs of your API Project (or Argus Project if combined)
    // using YourSharedDataProject.Data; // For DbContext
    // using YourSharedDataProject.Models; // For Argus models
    // using YourApiProject.Dtos; // For Data Transfer Objects

    // var builder = WebApplication.CreateBuilder(args);
    // If in a separate API project, you'd register your DbContextFactory here:
    // builder.Services.AddDbContextFactory<MyDbContext>(options => 
    //     options.UseNpgsql(builder.Configuration.GetConnectionString("CardanoContext")));
    
    var app = builder.Build();

    var apiV1 = app.MapGroup("/api/v1").WithTags("Cardano Data API v1"); // Group and tag for OpenAPI

    apiV1.MapGet("/blocks/latest", async (
        IDbContextFactory<MyDbContext> dbFactory, 
        int? count) =>
    {
        try
        {
            await using var dbContext = await dbFactory.CreateDbContextAsync();
            var takeCount = count ?? 10;
            var latestBlocks = await dbContext.BlocksBySlot 
                .OrderByDescending(b => b.Slot)
                .Take(takeCount)
                .Select(b => new BlockSummaryDto(b.Slot, b.Hash, b.BlockTime)) // Using a DTO
                .ToListAsync();
            return Results.Ok(latestBlocks);
        }
        catch (Exception ex)
        {
            // Log the exception (ex)
            return Results.Problem("An error occurred while fetching latest blocks.", statusCode: 500);
        }
    })
    .WithName("GetLatestBlocks")
    .Produces<IEnumerable<BlockSummaryDto>>(StatusCodes.Status200OK)
    .Produces(StatusCodes.Status500InternalServerError);   

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
            : Results.Ok(block); // Or map to a BlockDetailDto
    })
    .WithName("GetBlockBySlot")
    .Produces<BlockBySlot>() // Replace BlockBySlot with your actual full block model/DTO
    .Produces(StatusCodes.Status404NotFound);
    
    // app.Run();
    ```

    :::note Organizing Minimal APIs
    For larger applications, group related Minimal API endpoints using `RouteGroupBuilder` (as shown with `apiV1`) or explore libraries like Carter or FastEndpoints for advanced modularity.
    :::

### Method 2: The Controller-Based Approach (Alternative)

Controllers offer a traditional structure, often preferred for complex APIs.

1. **Crafting Your API Controller**:
    In your API project, create `CardanoDataController.cs`.

    ```csharp
    // using Microsoft.AspNetCore.Mvc;
    // using Microsoft.EntityFrameworkCore;
    // using YourSharedDataProject.Data; 
    // using YourSharedDataProject.Models; // e.g., BlockBySlot
    // using YourApiProject.Dtos; // e.g., BlockSummaryDto

    // namespace YourApiProject.Controllers { ... }
    // [ApiController]
    // [Route("api/v1/data")] // Consistent versioning
    // public class CardanoDataController : ControllerBase { ... }
    ```

    *Inside the controller:*

    ```csharp
    [HttpGet("blocks/latest")]
    [ProducesResponseType(typeof(IEnumerable<BlockSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetLatestBlocks([FromQuery] int count = 10)
    {
        try
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync();
            var latestBlocks = await dbContext.BlocksBySlot 
                .OrderByDescending(b => b.Slot) 
                .Take(count)
                .Select(b => new BlockSummaryDto(b.Slot, b.Hash, b.BlockTime)) // Use DTO
                .ToListAsync();
            return Ok(latestBlocks);
        }
        catch (Exception ex)
        {
            // Log the exception (ex)
            return Problem("An error occurred while fetching latest blocks.", statusCode: 500);
        }
    }
    ```

2. **`DbContextFactory` Registration**: Same as Minimal APIs, ensure it's available via DI.

## 💡 Minimal API Examples & Use Cases

Let's illustrate with practical Minimal API examples.

:::info Data Transfer Objects (DTOs)
Using DTOs (simple classes/records representing the data shape for your API) is highly recommended. They allow you to:

* Decouple your API contract from your database entities.
* Return only necessary data, improving performance and security.
* Shape data conveniently for clients.
* Version your API responses more easily.

Example DTOs (place these in a `Dtos` folder in your API or Shared Core project):

```csharp
// public record BlockSummaryDto(ulong Slot, string Hash, DateTimeOffset BlockTime);
// public record AccountBalanceDto(string Address, ulong Lovelace, Dictionary<string, ulong> Assets, ulong UpdatedAtSlot);
// public record UtxoDto(string TxHash, uint Index, string Address, ulong LovelaceAmount /*, other asset details */);
// public record BlockDetailDto(ulong Slot, string Hash, DateTimeOffset BlockTime, int Size, ulong EpochNo, ulong EpochSlot /* ... other fields ... */);
// public record DexPriceDto(string TokenX, string TokenY, decimal PriceXPerY, decimal PriceYPerX, DateTimeOffset Timestamp);
:::

### Example 1: Fetching a Specific Block

* **Relevant Reducer**: `BlockBySlotReducer`
* **Minimal API Endpoint (within `apiV1` group)**:

    ```csharp
    // Assumes a BlockDetailDto (as conceptualized in the DTOs info block above)
    apiV1.MapGet("/block-details/{slot:ulong}", async (ulong slot, IDbContextFactory<MyDbContext> dbFactory) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var blockEntity = await dbContext.BlocksBySlot // From BlockBySlotReducer
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Slot == slot);
        
        if (blockEntity is null) return Results.NotFound($"Block {slot} not found.");
        
        // Map entity to your defined BlockDetailDto
        var blockDto = new BlockDetailDto(blockEntity.Slot, blockEntity.Hash, blockEntity.BlockTime, blockEntity.Size, blockEntity.EpochNo, blockEntity.EpochSlot /*, ... other fields */);
        return Results.Ok(blockDto);
    })
    .WithName("GetBlockDetails")
    .Produces<BlockDetailDto>() 
    .Produces(StatusCodes.Status404NotFound)
    .WithTags("Blocks API");
    ```

### Example 2: Retrieving Account Balances

* **Relevant Reducer**: `BalanceByAddressReducer`
* **Minimal API Endpoint (within `apiV1` group)**:

    ```csharp
    // Uses AccountBalanceDto (as conceptualized in the DTOs info block)
    apiV1.MapGet("/account/balance/{address}", async (string address, IDbContextFactory<MyDbContext> dbFactory) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var balance = await dbContext.BalanceByAddress // From BalanceByAddressReducer
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Address == address);

        if (balance == null) 
        {
            return Results.NotFound($"Balance data not found for {address}.");
        }
        
        var balanceDto = new AccountBalanceDto(
            balance.Address,
            balance.Lovelace,
            System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, ulong>>(balance.Assets ?? "{}"), 
            balance.UpdatedAtSlot
        );
        return Results.Ok(balanceDto);
    })
    .WithName("GetAccountBalance")
    .Produces<AccountBalanceDto>()
    .Produces(StatusCodes.Status404NotFound)
    .WithTags("Accounts API");
    ```

### Example 3: Listing UTXOs for an Address

* **Relevant Reducer**: Assumes a custom reducer populates a `DetailedUtxoRecord` table. `UtxoByAddressReducer` tracks references.
* **Minimal API Endpoint (within `apiV1` group)**:

    ```csharp
    // Assuming a custom model 'DetailedUtxoRecord' from your shared project:
    // public record DetailedUtxoRecord(string TxHash, uint Index, string Address, ulong Slot, ulong Lovelace /*, other asset fields */);
    // And a UtxoDto (as conceptualized in the DTOs info block)
    apiV1.MapGet("/account/utxos/{address}", async (string address, IDbContextFactory<MyDbContext> dbFactory) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var utxos = await dbContext.Set<DetailedUtxoRecord>() 
            .AsNoTracking()
            .Where(u => u.Address == address) 
            .OrderByDescending(u => u.Slot)
            .Select(u => new UtxoDto(u.TxHash, u.Index, u.Address, u.Lovelace /*, map other assets */)) 
            .ToListAsync();
        
        return !utxos.Any()
            ? Results.NotFound("No UTXOs found for this address.")
            : Results.Ok(utxos);
    })
    .WithName("GetAccountUtxos")
    .Produces<IEnumerable<UtxoDto>>()
    .Produces(StatusCodes.Status404NotFound)
    .WithTags("Accounts API");
    ```

### Example 4: Querying DEX Token Prices

* **Relevant Reducer**: `SundaePriceByTokenReducer`
* **Minimal API Endpoint (within `apiV1` group)**:

    ```csharp
    // Uses DexPriceDto (as conceptualized in the DTOs info block)
    apiV1.MapGet("/dex/price/sundae", async (
        [FromQuery] string tokenASubject, 
        [FromQuery] string tokenBSubject,
        IDbContextFactory<MyDbContext> dbFactory) =>
    {
        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var latestPriceEntity = await dbContext.Set<SundaePriceByToken>() // From SundaePriceByTokenReducer
            .AsNoTracking()
            .Where(p => (p.TokenXSubject == tokenASubject && p.TokenYSubject == tokenBSubject) ||
                         (p.TokenXSubject == tokenBSubject && p.TokenYSubject == tokenASubject))
            .OrderByDescending(p => p.Slot)
            .FirstOrDefaultAsync();

        if (latestPriceEntity == null)
        {
            return Results.NotFound($"Price data not found for pair {tokenASubject}/{tokenBSubject}.");
        }
        var priceDto = new DexPriceDto(latestPriceEntity.TokenXSubject, latestPriceEntity.TokenYSubject, latestPriceEntity.TokenXPerTokenY, latestPriceEntity.TokenYPerTokenX, latestPriceEntity.Timestamp);
        return Results.Ok(priceDto);
    })
    .WithName("GetSundaeSwapPrice")
    .Produces<DexPriceDto>()
    .Produces(StatusCodes.Status404NotFound)
    .WithTags("DEX API");
    ```

## ✨ API Best Practices

Elevate your API design with these practices. See also our [Applications Guide](./applications.md#-best-practices-for-integrating-argus).

### Navigating Large Datasets: Pagination

Paginate endpoints returning many items.

* **Technique**: Use `Skip()` & `Take()`.
* **Parameters**: `pageNumber`, `pageSize`.
* **Response**: Include metadata like `TotalItems`, `PageSize`, `CurrentPage`, `TotalPages`.

    ```csharp
    // Minimal API Example for paginating blocks (using BlockSummaryDto from DTO examples)
    apiV1.MapGet("/blocks", async (
        IDbContextFactory<MyDbContext> dbFactory,
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 20) =>
    {
        if (pageNumber <= 0) pageNumber = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 20;

        await using var dbContext = await dbFactory.CreateDbContextAsync();
        var totalItems = await dbContext.BlocksBySlot.CountAsync(); // From BlockBySlotReducer
        var items = await dbContext.BlocksBySlot
            .OrderByDescending(b => b.Slot)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new BlockSummaryDto(b.Slot, b.Hash, b.BlockTime)) // Use DTO
            .ToListAsync();

        return Results.Ok(new { // Consider a PaginatedResponseDto<T>
            TotalItems,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
            Items = items
        });
    })
    .WithName("GetPaginatedBlocks")
    .Produces<object>() // Replace object with your PaginatedResponseDto<BlockSummaryDto>
    .WithTags("Blocks API");
    ```

### Refining Results: Filtering and Sorting

Allow clients to filter and sort data via query parameters (e.g., `?status=active&sortBy=date`).

### Consistent by Design: Response Structure

Adopt a uniform structure for responses. A **custom standardized response wrapper** is often beneficial, containing fields like a boolean `success` flag, a `data` payload, and an `error` object.

### Graceful Degradation: Error Handling

Employ standard HTTP status codes. Use `try-catch` for unexpected issues, returning `Results.Problem` or `Problem()`.

:::tip Custom vs. Built-in Responses
ASP.NET Core's built-in `Results` (Minimal APIs) and `ActionResults` (controllers) are ideal for setting correct HTTP status codes. However, for a superior developer experience, consider pairing them with a **custom response wrapper** (see "Consistent by Design"). This wrapper ensures a consistent response body structure for data and errors, making client-side parsing more reliable, while standard HTTP status codes still convey the overall outcome.
:::

### Versioning for Evolution: API Versioning

Version your API from day one (e.g., `/api/v1/...`).

### Optimizing Delivery: Caching Strategies

Cache frequently accessed, rarely changing data.

### Asynchronous All the Way: Async Operations

Use `async` and `await` for I/O-bound operations.

### Fortifying Your Endpoints: Security Measures

Implement authentication, authorization, input validation, rate limiting, and always use HTTPS in production.

### Optimizing the Core: Database Query Performance

Efficient database queries are crucial for API speed.

* **The Power of Indexing**:
  * **Key Columns**: Index columns in `WHERE`, `JOIN`, `ORDER BY` clauses (e.g., `Address`, `Slot`, `TxHash`).
  * **Argus's Default Indexing**: Built-in reducers often create indexed primary keys.
  * **Custom Indexes**: Define in `DbContext.OnModelCreating`. See [Efficient Database Design](./applications.md#-efficient-database-design).

    ```csharp
    // Inside YourDbContext.cs 
    // modelBuilder.Entity<YourModel>().HasIndex(e => e.PropertyToİndex);
    ```

  * **Migrations**: `dotnet ef migrations add MyNewIndexes`, `dotnet ef database update`.

* **Writing Smart LINQ Queries**:
  * **Precision with `.Select()` (Querying Only Needed Data)**: Fetch only the columns (materialize only the data) your API endpoint actually needs by projecting to DTOs or anonymous types. This is vital for performance.

    ```csharp
    var blockSummaries = await dbContext.BlocksBySlot
        .OrderByDescending(b => b.Slot)
        .Take(10)
        .Select(b => new BlockSummaryDto(b.Slot, b.Hash, b.BlockTime)) // Use DTO
        .ToListAsync();
    ```

  * **Read-Only Speed with `.AsNoTracking()`**: Use for queries that don't change data.
  * **Database-Side Filtering**: Apply `Where` clauses early.
  * **Avoiding N+1 Problems**: Use projections or `Include()` judiciously.

* **Analysis & Monitoring**:
  * **EF Core Logging**: To inspect generated SQL.
  * **Database Execution Plans**: For diagnosing slow queries.

:::important Query Optimization is Fundamental
Proper indexing and efficient queries are key to a scalable API.
:::

## 🚀 Conclusion & Next Steps

You've now journeyed through building APIs with Argus-indexed data! By applying these principles, you can develop robust, performant services.

Argus structures blockchain data for easy querying. Well-designed APIs unlock this power.

**What's Next?**

* **Deeper Reducer Knowledge**: Explore [Built-in Reducers](../usage-guides/builtin-reducers.md) or craft advanced custom ones.
* **Advanced API Patterns**: Consider WebSockets, GraphQL, or HATEOAS.
* **Rigorous Testing**: Implement unit, integration, and load tests.
* **API Documentation**: Use Swagger/OpenAPI for interactive documentation.
