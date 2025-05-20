---
title: Building Data APIs
sidebar_position: 3
---

# 📄 Building Data APIs

This guide details the development of Application Programming Interfaces (APIs) for serving Cardano blockchain data indexed by the Argus.Sync framework. It covers practical implementation strategies using ASP.NET Core, including both Minimal APIs and traditional controller-based designs. The objective is to enable developers to integrate indexed blockchain data effectively into various applications, such as front-end UIs, backend services, and external developer tooling.

## 🎯 Introduction & Prerequisites

Before commencing API development, ensure that your Argus.Sync environment is correctly configured and your data models are well-defined. A solid foundation in these areas is crucial for a streamlined development process.

### Prerequisites Checklist

- **An Active Argus.Sync Project**:
  - Your .NET project should have Argus.Sync installed and configured.
  - For a complete walkthrough of setting up a new Argus project—including defining data models (`IReducerModel`), implementing a basic reducer, and configuring your `DbContext` (e.g., `MyDbContext`)—please refer to our comprehensive [**Quick Start Guide**](../getting-started/quick-start.md).
  - For general setup information, see the [Setup Guides overview](./index.md).
- **Understanding of Reducers**:
  - Familiarity with how reducers (custom or built-in) populate your database.
  - Explore the functionality of [**Built-in Reducers**](../usage-guides/builtin-reducers.md).
- **ASP.NET Core Web API Basics**: A working knowledge of creating API endpoints, particularly using Minimal API syntax for this guide's primary focus.
- **Database Fundamentals**: A basic understanding of database indexes will be beneficial for the optimization sections.

:::important Database Support
Currently, Argus.Sync exclusively supports **PostgreSQL** as its database backend. Ensure your environment and `DbContext` are configured accordingly.
:::

<details>
<summary><strong>🔍 Blockchain API Design Considerations</strong></summary>

When designing APIs for blockchain data, consider these special factors:

- **Data Volume**: Blockchains generate massive amounts of data. Efficient filtering and pagination are not just best practices, but necessities.
- **Data Relationships**: Blockchain entities like blocks, transactions, UTXOs, and addresses are highly interconnected. Your API design should reflect these relationships logically.
- **Historical Data**: Users often need to query historical blockchain states. Consider how to efficiently provide time-based access to data.
- **Real-time Updates**: Some applications require near real-time notification of new blocks or transactions. Consider implementing webhooks or SignalR for push-based updates.
- **Specialized Use Cases**: Different applications have very different needs - from simple balance lookups to complex analytics. Design your API to accommodate various query patterns.

</details>

## 🛠️ Step-by-Step API Construction

Let's build the API endpoints! We'll focus on the streamlined Minimal APIs approach, noting controller-based methods as alternatives.

### Architectural Consideration: Separate API Project

For larger or production-grade systems, consider creating your **API in a separate project** rather than directly within your Argus indexer project. This modular approach offers several advantages:

&nbsp;

**Why a Separate API Project is Often Better:**

- **Clearer Focus**: Keeps your indexer project dedicated to indexing and your API project dedicated to data exposure.
- **Independent Scaling**: Scale API instances and indexer instances independently based on their specific loads.
- **Independent Deployments**: Update and deploy the API without impacting the indexer, and vice-versa.
- **Focused Dependencies**: API projects can have web-specific dependencies (e.g., Swagger) without bloating the indexer.
- **Enhanced Security**: The API acts as a distinct security perimeter for data access.

**How This Modular Setup Works:**

1. **Shared Core Project (Class Library)**: A common class library project, referenced by both the indexer and API projects, would contain your `DbContext`, data models (`IReducerModel`), DTOs, and any shared logic or services.
2. **Unified Database**: Both the Argus indexer and the API project connect to the same PostgreSQL database.

:::info A Note on This Guide's Examples
For simplicity, the examples in this guide demonstrate adding API endpoints as if they might be in the same project. However, the core principles apply universally. We strongly recommend a separate API project for production applications.
:::

<details>
<summary><strong>📝 Reference Architecture Diagram</strong></summary>

```
┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │
│  Argus Indexer    │     │    API Service    │
│  Application      │     │    Application    │
│                   │     │                   │
└─────────┬─────────┘     └─────────┬─────────┘
          │                         │
          │                         │
          │     ┌─────────────────────────┐
          │     │                         │
          ├────►│   Shared Class Library  │◄─────┐
          │     │   (Models, DbContext)   │      │
          │     │                         │      │
          │     └─────────────────────────┘      │
          │                                      │
          │                                      │
          │     ┌─────────────────────────┐      │
          │     │                         │      │
          └────►│     PostgreSQL DB       │──────┘
                │                         │
                └─────────────────────────┘
```

This architecture allows the API service to read from the same database that the Argus indexer writes to, while maintaining separation of concerns and deployment flexibility.

</details>

### Method 1: Minimal APIs - Concise and Direct

Minimal APIs offer a concise style for building focused endpoints directly in your `Program.cs` or organized route files.

1. **Service Registration Check**:
   Ensure `IDbContextFactory<MyDbContext>` is registered in your `Program.cs` (typically handled by Argus setup).

2. **Defining Endpoints in `Program.cs`**:
   Map HTTP requests directly to asynchronous lambda handlers.

   ```csharp
   // In Program.cs of your API Project (or Argus Project if combined)
   using YourSharedDataProject.Data; // For DbContext
   using YourSharedDataProject.Models; // For Argus models
   using YourApiProject.Dtos; // For Data Transfer Objects

   var builder = WebApplication.CreateBuilder(args);
   // If in a separate API project, you'd register your DbContextFactory here:
   builder.Services.AddDbContextFactory<MyDbContext>(options =>
   options.UseNpgsql(builder.Configuration.GetConnectionString("CardanoContext")));

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

1. **Creating Your API Controller**:
   In your API project, create `CardanoDataController.cs`.

   ```csharp
   using Microsoft.AspNetCore.Mvc;
   using Microsoft.EntityFrameworkCore;
   using YourSharedDataProject.Data;
   using YourSharedDataProject.Models; // e.g., BlockBySlot
   using YourApiProject.Dtos; // e.g., BlockSummaryDto

   namespace YourApiProject.Controllers { ... }
   [ApiController]
   [Route("api/v1/data")] // Consistent versioning
   public class CardanoDataController : ControllerBase { ... }
   ```

   _Inside the controller:_

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

<details>
<summary><strong>🔄 When to Choose Controllers vs. Minimal APIs</strong></summary>

| Use Controllers When                                                 | Use Minimal APIs When                                    |
| -------------------------------------------------------------------- | -------------------------------------------------------- |
| Building complex APIs with many endpoints                            | Building small to medium APIs with focused functionality |
| Needing advanced MVC features (filters, model binding customization) | Preferring simplicity and conciseness                    |
| Working with a large team that's familiar with MVC                   | Working solo or in small teams prioritizing readability  |
| Having complex validation or business logic                          | Having relatively straightforward endpoint behavior      |
| Building APIs that will grow significantly over time                 | Building microservices or dedicated purpose APIs         |
| Using MVC-specific attributes extensively                            | Focusing on modern, lightweight approaches               |

Both approaches ultimately compile to the same ASP.NET Core middleware pipeline, so the choice is mostly about code organization, readability, and team preference.

</details>

## 💡 Minimal API Examples & Use Cases

This section provides practical examples of Minimal API endpoints, illustrating common data retrieval scenarios.

&nbsp;

:::info Data Transfer Objects (DTOs)
Using DTOs (simple classes/records representing the data shape for your API) is highly recommended. They allow you to:

- Decouple your API contract from your database entities.
- Return only necessary data, improving performance and security.
- Shape data conveniently for clients.
- Version your API responses more easily.

Example DTOs (place these in a `Dtos` folder in your API or Shared Core project):

```csharp
public record BlockSummaryDto(ulong Slot, string Hash, DateTimeOffset BlockTime);
public record AccountBalanceDto(string Address, ulong Lovelace, Dictionary<string, ulong> Assets, ulong UpdatedAtSlot);
public record UtxoDto(string TxHash, uint Index, string Address, ulong LovelaceAmount /*, other asset details */);
public record BlockDetailDto(ulong Slot, string Hash, DateTimeOffset BlockTime, int Size, ulong EpochNo, ulong EpochSlot /* ... other fields ... */);
public record DexPriceDto(string TokenX, string TokenY, decimal PriceXPerY, decimal PriceYPerX, DateTimeOffset Timestamp);
```

:::

### Example 1: Fetching a Specific Block

- **Relevant Reducer**: `BlockBySlotReducer`
- **Minimal API Endpoint (within `apiV1` group)**:

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

- **Relevant Reducer**: `BalanceByAddressReducer`
- **Minimal API Endpoint (within `apiV1` group)**:

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

- **Relevant Reducer**: Assumes a custom reducer populates a `DetailedUtxoRecord` table. `UtxoByAddressReducer` tracks references.
- **Minimal API Endpoint (within `apiV1` group)**:

  ```csharp
  // Assuming a custom model 'DetailedUtxoRecord' from your shared project:
  public record DetailedUtxoRecord(string TxHash, uint Index, string Address, ulong Slot, ulong Lovelace /*, other asset fields */);
  
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

- **Relevant Reducer**: `SundaePriceByTokenReducer`
- **Minimal API Endpoint (within `apiV1` group)**:

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

- **Technique**: Use `Skip()` & `Take()`.
- **Parameters**: `pageNumber`, `pageSize`.
- **Response**: Include metadata like `TotalItems`, `PageSize`, `CurrentPage`, `TotalPages`.

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

<details>
<summary><strong>⚡ Alternative Pagination Approaches</strong></summary>

While the offset-based pagination shown above (`Skip`/`Take`) is common, there are other approaches that may be more efficient for large datasets:

### Keyset Pagination (Cursor-based)

Keyset pagination uses a "cursor" (usually the unique identifier of the last item from the previous page) to fetch the next set of results. This approach is more efficient for large datasets as it avoids the performance degradation that occurs with large offsets.

```csharp
// Example of cursor-based pagination for blocks
apiV1.MapGet("/blocks/cursor", async (
    IDbContextFactory<MyDbContext> dbFactory,
    [FromQuery] ulong? afterSlot,
    [FromQuery] int limit = 20) =>
{
    if (limit <= 0 || limit > 100) limit = 20;

    await using var dbContext = await dbFactory.CreateDbContextAsync();

    // Start query with all blocks
    var query = dbContext.BlocksBySlot.AsNoTracking();

    // If afterSlot is provided, only get blocks with slots lower than it
    // (assuming we're paging backwards through time)
    if (afterSlot.HasValue)
    {
        query = query.Where(b => b.Slot < afterSlot.Value);
    }

    // Get one more item than requested to determine if there are more pages
    var items = await query
        .OrderByDescending(b => b.Slot)
        .Take(limit + 1)
        .Select(b => new BlockSummaryDto(b.Slot, b.Hash, b.BlockTime))
        .ToListAsync();

    // Check if we have more items
    bool hasNextPage = items.Count > limit;

    // Remove the extra item if we fetched it
    if (hasNextPage)
    {
        items.RemoveAt(items.Count - 1);
    }

    // Get the cursor for the next page
    ulong? nextCursor = items.LastOrDefault()?.Slot;

    return Results.Ok(new {
        Items = items,
        HasNextPage = hasNextPage,
        NextCursor = nextCursor
    });
});
```

### Time-based Pagination for Blockchain Data

For blockchain data, time-based ranges often make more sense than arbitrary page numbers:

```csharp
apiV1.MapGet("/blocks/time-range", async (
    IDbContextFactory<MyDbContext> dbFactory,
    [FromQuery] DateTimeOffset startTime,
    [FromQuery] DateTimeOffset? endTime = null,
    [FromQuery] int limit = 100) =>
{
    if (limit <= 0 || limit > 500) limit = 100;
    endTime ??= DateTimeOffset.UtcNow;

    await using var dbContext = await dbFactory.CreateDbContextAsync();

    var blocks = await dbContext.BlocksBySlot
        .Where(b => b.BlockTime >= startTime && b.BlockTime <= endTime)
        .OrderByDescending(b => b.BlockTime)
        .Take(limit)
        .Select(b => new BlockSummaryDto(b.Slot, b.Hash, b.BlockTime))
        .ToListAsync();

    return Results.Ok(blocks);
});
```

Each pagination approach has trade-offs. Choose based on your specific data access patterns and performance needs.

</details>

### Filtering and Sorting

Empowering clients to request precisely the data they need is crucial for an efficient API. Implementing robust filtering and sorting capabilities reduces data transfer, offloads processing from the client, and enhances the user experience.

- **Filtering Strategies**:

  - **Query Parameters**: The most common method. Allow clients to filter collections based on specific field values.
    - Example: `GET /api/v1/transactions?address={address}&type=outgoing&minAmount=1000000`
    - Example: `GET /api/v1/blocks?minSlot={slotNumber}&maxSlot={slotNumber}`
  - **Implementation**: In your API endpoints, accept these query parameters and apply corresponding `Where()` clauses to your LINQ queries.

  ```csharp
  // Minimal API Example Fragment for Filtering Transactions
  // (within an app.MapGet("/api/v1/transactions", async (...) => { ... }) handler)

  IQueryable<TransactionEntity> query = dbContext.Transactions.AsQueryable();

  if (httpContext.Request.Query.TryGetValue("address", out var addressValue))
  {
      query = query.Where(tx => tx.SomeAddressField == addressValue);
  }
  if (httpContext.Request.Query.TryGetValue("minAmount", out var minAmountStr) && ulong.TryParse(minAmountStr, out var minAmount))
  {
      query = query.Where(tx => tx.Amount >= minAmount);
  }
  var results = await query.Select(tx => new TransactionDto(...)).ToListAsync();
  ```

  - **Validation**: Always validate and sanitize filter inputs to prevent errors and potential security issues (e.g., ensure numeric inputs are indeed numbers, trim string inputs).

- **Sorting Strategies**:

  - **Query Parameters**: Allow clients to specify the field to sort by and the direction (ascending/descending).
    - Example: `GET /api/v1/blocks?sortBy=slot&order=desc`
  - **Implementation**: Dynamically apply `OrderBy()` or `OrderByDescending()` to your LINQ queries. Be cautious about allowing sorting on unindexed fields for large datasets due to performance implications.

  ```csharp
  // Minimal API Example Fragment for Sorting Blocks
  // (within an app.MapGet("/api/v1/blocks", async (...) => { ... }) handler)
  //
  IQueryable<BlockBySlot> query = dbContext.BlocksBySlot.AsQueryable();
  string sortBy = httpContext.Request.Query["sortBy"].FirstOrDefault() ?? "slot";
  bool descending = (httpContext.Request.Query["order"].FirstOrDefault() ?? "asc").Equals("desc", StringComparison.OrdinalIgnoreCase);

  query = sortBy.ToLowerInvariant() switch
  {
      "epoch" => descending ? query.OrderByDescending(b => b.EpochNo) : query.OrderBy(b => b.EpochNo),
      "size" => descending ? query.OrderByDescending(b => b.Size) : query.OrderBy(b => b.Size),
      _ => descending ? query.OrderByDescending(b => b.Slot) : query.OrderBy(b => b.Slot), // Default to slot
  };
  var results = await query.Select(b => new BlockSummaryDto(...)).ToListAsync();
  ```

  - **Advanced Filtering**: For complex scenarios (e.g., dynamic logical operators `AND`/`OR`, nested property filtering), consider libraries like `Sieve` or `QueryKit` that integrate with Entity Framework Core, or explore specifications like OData. These can simplify building dynamic queries but add a dependency.

### Error Handling

**Use Standard HTTP Status Codes**: These are the first indication to the client about the outcome of their request.

- `2xx` (Success): `200 OK`, `201 Created`, `204 No Content`
- `4xx` (Client Errors):
  - `400 Bad Request`: For general client errors, often due to invalid input or malformed requests. The response body should ideally detail the validation failures.
  - `401 Unauthorized`: Authentication is required and has failed or has not yet been provided.
  - `403 Forbidden`: The authenticated client does not have permission to access the requested resource.
  - `404 Not Found`: The requested resource could not be found.
- `5xx` (Server Errors):
  - `500 Internal Server Error`: A generic error message for unexpected server-side conditions. Avoid leaking sensitive stack traces or internal error details to the client in production environments.

&nbsp;

:::tip Custom vs. Built-in Responses
ASP.NET Core's built-in `Results` (Minimal APIs) and `ActionResults` (controllers) are ideal for setting correct HTTP status codes. However, for a superior developer experience, consider pairing them with a **custom response wrapper**. This wrapper ensures a consistent response body structure for data and errors, making client-side parsing more reliable, while standard HTTP status codes still convey the overall outcome.
:::

### API Documentation with OpenAPI/Swagger

Comprehensive documentation is essential for your API's adoption and correct usage. OpenAPI (formerly Swagger) provides a standardized way to document your APIs and generate interactive documentation.

&nbsp;

**Benefits**:

- Self-documenting API behavior
- Interactive testing interface for developers
- Client SDK generation for multiple languages
- Simplified onboarding for new consumers

**Implementation**:

```csharp
// In Program.cs
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Cardano Data API",
        Version = "v1",
        Description = "API for accessing indexed Cardano blockchain data",
        Contact = new OpenApiContact
        {
            Name = "Your Name",
            Email = "your.email@example.com",
            Url = new Uri("https://your-website.com")
        },
        License = new OpenApiLicense
        {
            Name = "MIT",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });
});

// Configure the HTTP request pipeline
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Cardano Data API v1");
        options.RoutePrefix = "swagger";
    });
}
```

This setup provides a rich, interactive documentation UI available at `/swagger` in development environments.

### Caching for Performance

Blockchain data is immutable once confirmed, making it an excellent candidate for caching. Implement appropriate caching strategies to reduce database load and improve response times.

&nbsp;

**Response Caching**:

- Use the built-in ASP.NET Core response caching middleware
- Set appropriate cache headers for different data types
- Consider client-side caching directives

```csharp
// Add response caching services
builder.Services.AddResponseCaching();

// Apply response caching middleware
app.UseResponseCaching();

// Example endpoint with caching
apiV1.MapGet("/blocks/{slot:ulong}", async (ulong slot, IDbContextFactory<MyDbContext> dbFactory) =>
{
    // Implementation...
})
.WithName("GetBlockBySlot")
.Produces<BlockDetailDto>()
.Produces(StatusCodes.Status404NotFound)
.CacheOutput(policy => policy.Cache()
                             .MaxAge(3600) // Cache for 1 hour
                             .VaryByQuery("slot"));
```

### Optimizing the Core: Database Query Performance

Efficient database queries are crucial for API speed.

&nbsp;

**The Power of Indexing**:

- **Key Columns**: Index columns in `WHERE`, `JOIN`, `ORDER BY` clauses (e.g., `Address`, `Slot`, `TxHash`).
- **Argus's Default Indexing**: Built-in reducers often create indexed primary keys.
- **Custom Indexes**: Define in `DbContext.OnModelCreating`. See [Efficient Database Design](./applications.md#-efficient-database-design).

  ```csharp
  // Inside YourDbContext.cs
  // modelBuilder.Entity<YourModel>().HasIndex(e => e.PropertyToİndex);
  ```

- **Migrations**: `dotnet ef migrations add MyNewIndexes`, `dotnet ef database update`.

**Writing Smart LINQ Queries**:

- **Precision with `.Select()` (Querying Only Needed Data)**: Fetch only the columns (materialize only the data) your API endpoint actually needs by projecting to DTOs or anonymous types. This is vital for performance.

  ```csharp
  var blockSummaries = await dbContext.BlocksBySlot
      .OrderByDescending(b => b.Slot)
      .Take(10)
      .Select(b => new BlockSummaryDto(b.Slot, b.Hash, b.BlockTime)) // Use DTO
      .ToListAsync();
  ```

- **Read-Only Speed with `.AsNoTracking()`**: Use for queries that don't change data.
- **Database-Side Filtering**: Apply `Where` clauses early.
- **Avoiding N+1 Problems**: Use projections or `Include()` judiciously.

**Analysis & Monitoring**:

- **EF Core Logging**: To inspect generated SQL.
- **Database Execution Plans**: For diagnosing slow queries.

:::important Query Optimization is Fundamental
Proper indexing and efficient queries are key to a scalable API.
:::

<details>
<summary><strong>📊 Monitoring Your API</strong></summary>

Implementing robust monitoring is essential for maintaining a reliable blockchain data API. Consider these monitoring strategies:

### Application Performance Monitoring (APM)

Integrate an APM solution like Application Insights, New Relic, or Datadog to track:

- Request rates, durations, and error rates
- Endpoint performance metrics
- Database query performance
- Exception tracking and alerting

```csharp
// Adding Application Insights to your ASP.NET Core API
builder.Services.AddApplicationInsightsTelemetry();

// Custom tracking for important operations
public async Task<IActionResult> GetComplexBlockchainData()
{
    using (var operation = telemetryClient.StartOperation<RequestTelemetry>("GetComplexBlockchainData"))
    {
        try
        {
            // Your code here
            telemetryClient.TrackMetric("DataSize", resultSize);
            return Ok(result);
        }
        catch (Exception ex)
        {
            telemetryClient.TrackException(ex);
            throw;
        }
    }
}
```

### Health Checks

Implement health checks to monitor the status of your API and its dependencies:

```csharp
// Add health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<MyDbContext>("database")
    .AddCheck("chain-sync", () =>
    {
        // Check if the indexer is keeping up with the blockchain
        var syncStatus = /* get sync status */;
        return syncStatus.IsBehind
            ? HealthCheckResult.Degraded($"Chain sync is {syncStatus.BlocksBehind} blocks behind")
            : HealthCheckResult.Healthy();
    });

// Configure health check endpoints
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("live"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

### Metrics and Dashboards

Expose metrics for Prometheus or other monitoring systems:

```csharp
// Add Prometheus metrics
builder.Services.AddMetrics();
builder.Services.AddMetricsEndpoints();
builder.Services.AddPrometheusMetrics();

// Register custom metrics
services.AddSingleton<Counter>(
    Metrics.CreateCounter("api_requests_total", "Total number of API requests"));

// Use metrics in your API
app.Use(async (context, next) =>
{
    var counter = context.RequestServices.GetRequiredService<Counter>();
    counter.Inc();
    await next();
});

// Map metrics endpoint
app.MapMetrics();
```

### Rate Monitoring and Alerts

Set up alerts for critical conditions:

- Sudden increases in error rates
- Significant performance degradation
- Database connection issues
- Sync falling behind the blockchain tip
- Abnormal request patterns (potential abuse)

Effective monitoring ensures you can proactively address issues before they affect your users and maintain high availability for your blockchain data API.

</details>

## 🚀 Conclusion & Next Steps

You have now explored the methodologies for constructing APIs that serve Cardano blockchain data indexed by Argus.Sync. By applying the principles of clear architectural separation, leveraging appropriate ASP.NET Core features (Minimal APIs or Controllers), and adhering to best practices for DTO usage, pagination, filtering, error handling, versioning, caching, and query optimization, you can develop robust, performant, and maintainable services.

Argus.Sync provides the structured data foundation; well-designed APIs are the key to unlocking its value for your applications and users.

&nbsp;

**Further Exploration:**

- **Advanced Reducer Implementation**: Deepen your understanding by exploring the [Built-in Reducers](../usage-guides/builtin-reducers.md) or by developing sophisticated custom reducers tailored to unique data requirements.
- **Comprehensive Testing Strategies**: Implement a thorough testing suite encompassing unit tests (for business logic), integration tests (for API endpoints and database interaction), and load tests (to ensure performance under stress).
- **API Documentation and Discoverability**: Utilize tools like Swagger/OpenAPI (which integrates well with ASP.NET Core) to generate interactive API documentation, making it easier for consumers to understand and integrate with your API.

<details>
<summary><strong>📚 Recommended Resources</strong></summary>

### Documentation and Learning Resources

- [ASP.NET Core Minimal APIs Documentation](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [OpenAPI/Swagger in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger)
- [Versioning ASP.NET Core APIs](https://github.com/dotnet/aspnet-api-versioning/wiki)

### Tools and Libraries

- [Carter](https://github.com/CarterCommunity/Carter) - Framework for working with Minimal APIs
- [FastEndpoints](https://github.com/FastEndpoints/FastEndpoints) - Alternative to MVC controllers
- [SwaggerUI](https://swagger.io/tools/swagger-ui/) - Interactive API documentation
- [Polly](https://github.com/App-vNext/Polly) - Resilience and transient-fault-handling library

### Blogs and Articles

- [Best Practices for REST API Design](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
- [RESTful API Design: 13 Best Practices](https://florimond.dev/en/posts/2018/08/restful-api-design-13-best-practices-to-make-your-users-happy)
- [Performance Best Practices for EF Core](https://docs.microsoft.com/en-us/ef/core/performance/efficient-querying)

</details>
