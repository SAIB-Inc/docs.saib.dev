---
title: Applications
sidebar_position: 2
---

# ✨ Applications

This guide explores practical applications of Argus and provides best practices for integrating it into your Cardano blockchain projects.

## 💻 Example Use Cases

Argus's flexible architecture makes it suitable for a wide range of blockchain applications. Here are some concrete examples:

### 💰 Balance By Address Tracker

Want to track the current active balance of addresses on the blockchain? Let's design a model to handle this:

```csharp
// Balance by address model
public record BalanceByAddress(
    string Address,      // The wallet address
    decimal LovelaceAmount,  // Amount in lovelace
    Dictionary<string, long> Tokens, // Native token balances
    DateTime LastUpdated     // When balance was last modified
) : IReducerModel;
```

#### How the Reducer Works

The `BalanceByAddressReducer` plays a crucial role in maintaining accurate on-chain balances. Here's how it functions:
<br/>
> **During RollForwardAsync:**  
> When processing new blocks, the reducer examines each transaction to track the flow of assets. It identifies both input addresses
> (where funds are coming from) and output addresses (where funds are going to). For each address involved in a transaction, the
> reducer either creates a new balance record or updates an existing one. The lovelace amounts are adjusted based on whether the
> address is sending or receiving funds. Similarly, native token balances are updated in the dictionary, with zero-amount tokens
> being removed to save space.
>

> **During RollBackwardAsync:**
> In the event of a chain rollback, the reducer must revert balances to their previous state. This requires careful tracking of
> balance changes by slot, allowing the system to restore the exact state from before the rollback point. Without this capability,
> address balances could reflect transactions that never actually occurred on the canonical chain.
>

This powerful approach lets you:
- Provide users with real-time balance information
- Track changes in token holdings across different addresses
- Monitor wealth distribution on the blockchain
- Detect significant balance movements across addresses

### 💱 DeFi Protocol Monitor

Want to build a system that tracks DEX activity? Your reducers will need to process liquidity pool changes and swap transactions. Here are the models to get started:

```csharp
// DEX pool model
public record DexPool(
    string PoolId,
    string TokenA,
    string TokenB,
    decimal TokenAAmount
) : IReducerModel;

// Swap transaction model
public record SwapTransaction(
    string TxHash,
    string PoolId,
    string SwapType, // "AtoB" or "BtoA"
    decimal AmountIn,
    decimal AmountOut
) : IReducerModel;
```

#### How the Reducer Works

The `DexActivityReducer` captures the dynamic activity of decentralized exchanges by monitoring specific transaction patterns:
<br/>
> **During RollForwardAsync:**  
> The reducer analyzes each transaction's metadata and script execution results to identify DEX-related operations. For pool creation events, it
> initializes new DexPool records with starting token amounts. When liquidity is added or removed, it adjusts the token balances accordingly.
> For swap transactions, it captures both the details of the swap (amounts, direction, etc.) and updates the affected pool's token balances to
> reflect the new state. The reducer must recognize various DEX protocol signatures in the transaction data to properly categorize and process
> these operations.
>

> **During RollBackwardAsync:**
> During chain rollbacks, the reducer must restore pool states to their previous values. This involves undoing any liquidity changes or swaps
> that occurred in blocks after the rollback point. To achieve this, the reducer either maintains historical snapshots of pool states or
> calculates reverse operations based on the recorded transactions. This ensures that analysis based on DEX activity remains accurate even
> after chain reorganizations.
>

This enables you to help users:
- Track liquidity across multiple DEX protocols
- Calculate and compare swap prices
- Identify arbitrage opportunities
- Monitor impermanent loss

### 🎨 NFT Collection Tracker

Looking to track NFT marketplace activity? Let's design the models your reducers will need to process NFT sales and collection data:

```csharp
// NFT collection model
public record NftCollection(
    string PolicyId,
    string Name,
    int TotalSupply,
    decimal FloorPrice
) : IReducerModel;

// NFT sale model
public record NftSale(
    string PolicyId,
    string AssetName,
    string Seller,
    string Buyer,
    decimal PriceInAda
) : IReducerModel;
```

#### How the Reducer Works

The `NftMarketReducer` tracks the dynamic NFT marketplace by monitoring transactions that represent NFT transfers and sales:
<br/>
> **During RollForwardAsync:**  
> The reducer scans each transaction for native token transfers that match known NFT policy IDs. When it identifies a potential NFT sale
> (typically by recognizing marketplace script addresses or metadata formats), it extracts the sale details including the asset being sold,
> the seller and buyer addresses, and the price paid in ADA. It then creates an NftSale record and updates the associated NftCollection
> statistics. If the sale represents a new floor price, the collection record is updated accordingly, giving users accurate market data.
>

> **During RollBackwardAsync:**
> When a chain rollback occurs, the reducer must undo any NFT sales that were recorded after the rollback point. This means removing
> sale records and recalculating collection statistics like floor prices and volumes. This is particularly challenging for statistics
> like floor prices, which might require examining the entire sales history to correctly restore the previous state. Proper implementation
> ensures that market analytics remain accurate even after blockchain reorganizations.
>

With this approach, you can build features that:
- Track floor prices and sales velocity
- Analyze market trends for specific collections
- Monitor for whale buying activity
- Build price history for specific assets

## 💪 Best Practices for Integrating Argus

### 💾 Efficient Database Design

1. **Optimize your data models:**
   ```csharp
   modelBuilder.Entity<Transaction>(entity =>
   {
       // Create appropriate indexes for frequent query patterns
       entity.HasIndex(e => e.Address);
       entity.HasIndex(e => e.Timestamp);
       
       // Use composite indexes for common query combinations
       entity.HasIndex(e => new { e.Address, e.Timestamp });
   });
   ```
   
   **Why it matters:** Blockchain data grows continuously, and without proper indexing, queries quickly become prohibitively slow as your database expands. Strategic indexes on frequently filtered fields (like addresses and timestamps) can improve query performance by orders of magnitude. Composite indexes are particularly valuable for blockchain data since users often want to see transactions for a specific address within a time range.

2. **Implement historical and active table system:**
   ```csharp
   // Active table - contains only current state
   public class ActiveTokenBalance
   {
       public string Address { get; set; }
       public string PolicyId { get; set; }
       public string AssetName { get; set; }
       public long Amount { get; set; }
       public ulong LastUpdatedSlot { get; set; }
   }

   // Historical table - contains all changes with slot information
   public class HistoricalTokenBalance
   {
       public string Address { get; set; }
       public string PolicyId { get; set; }
       public string AssetName { get; set; }
       public long AmountChange { get; set; } // Can be positive or negative
       public ulong Slot { get; set; }
       public string TxHash { get; set; }
   }

   // In your reducer
   public async Task RollForwardAsync(Block block)
   {
       using var db = dbContextFactory.CreateDbContext();
       foreach (var tx in ProcessTransactions(block))
       {
           // Record historical change
           db.HistoricalTokenBalances.Add(new HistoricalTokenBalance
           {
               Address = tx.Address,
               PolicyId = tx.PolicyId,
               AssetName = tx.AssetName,
               AmountChange = tx.AmountChange,
               Slot = block.Header().HeaderBody().Slot(),
               TxHash = tx.Hash
           });

           // Update active state
           var activeBalance = await db.ActiveTokenBalances.FindAsync(tx.Address, tx.PolicyId, tx.AssetName);
           if (activeBalance == null)
           {
               db.ActiveTokenBalances.Add(new ActiveTokenBalance
               {
                   Address = tx.Address,
                   PolicyId = tx.PolicyId,
                   AssetName = tx.AssetName,
                   Amount = tx.AmountChange,
                   LastUpdatedSlot = block.Header().HeaderBody().Slot()
               });
           }
           else
           {
               activeBalance.Amount += tx.AmountChange;
               activeBalance.LastUpdatedSlot = block.Header().HeaderBody().Slot();
           }
       }
       await db.SaveChangesAsync();
   }

   // Handle rollbacks efficiently
   public async Task RollBackwardAsync(ulong slot)
   {
       using var db = dbContextFactory.CreateDbContext();
       
       // Find all changes that need to be reverted
       var changesToRevert = await db.HistoricalTokenBalances
           .Where(h => h.Slot > slot)
           .OrderByDescending(h => h.Slot)
           .ToListAsync();
       
       // Process changes in reverse order
       foreach (var change in changesToRevert)
       {
           // Revert the active balance
           var activeBalance = await db.ActiveTokenBalances.FindAsync(
               change.Address, change.PolicyId, change.AssetName);
               
           if (activeBalance != null)
           {
               activeBalance.Amount -= change.AmountChange;
               activeBalance.LastUpdatedSlot = slot;
               
               // If balance is zero, optionally remove the record
               if (activeBalance.Amount == 0)
               {
                   db.ActiveTokenBalances.Remove(activeBalance);
               }
           }
       }
       
       // Remove historical records after the slot
       db.HistoricalTokenBalances.RemoveRange(
           db.HistoricalTokenBalances.Where(h => h.Slot > slot));
           
       await db.SaveChangesAsync();
   }
   ```
   
   **Why it matters:** The historical and active table system provides an optimal architecture for blockchain data. Active tables contain only the current state, making read operations extremely fast since they don't need to aggregate historical data. Historical tables store every change with slot information, making it possible to precisely reconstruct the state at any point in time and handle rollbacks efficiently. This dual-table approach gives you the benefits of both complete historical data and high-performance current-state queries.

3. **Implement data pruning strategies:**
   ```csharp
   // Periodically remove old or unnecessary data
   public async Task PruneHistoricalDataAsync()
   {
       using var db = dbContextFactory.CreateDbContext();
       var cutoffDate = DateTime.UtcNow.AddMonths(-6);
       
       // Remove old data while keeping recent history
       db.HistoricalPrices.RemoveRange(
           db.HistoricalPrices.Where(p => p.Timestamp < cutoffDate)
       );
       
       await db.SaveChangesAsync();
   }
   ```
   
   **Why it matters:** Even with perfect indexing, a continuously growing database will eventually experience performance degradation and increasing storage costs. Implementing a thoughtful pruning strategy allows you to maintain performance while keeping your most valuable data. For many applications, detailed historical data loses value over time and can be aggregated or removed while preserving recent data and important summary information.

### 🗼 Resilient Application Design

1. **Implement specific error handling:**
   ```csharp
   public async Task RollForwardAsync(Block block)
   {
       try
       {
           // Process block data
           // ...
       }
       catch (DbUpdateConcurrencyException concurrencyEx)
       {
           // Handle specific database concurrency issue
           logger.LogWarning(concurrencyEx, "Concurrency conflict while processing block {Hash}", block.Header().Hash());
           // Implement retry logic or conflict resolution
           await ResolveConflictAndRetry(block, concurrencyEx);
       }
       catch (InvalidOperationException invalidOpEx) when (invalidOpEx.Message.Contains("invalid metadata format"))
       {
           // Handle specific validation issues
           logger.LogWarning(invalidOpEx, "Invalid metadata format in block {Hash}", block.Header().Hash());
           // Skip problematic metadata but continue processing the block
           await ProcessBlockWithoutMetadata(block);
       }
       catch (Exception ex)
       {
           // For unexpected errors, log and rethrow
           logger.LogError(ex, "Unexpected error processing block {Hash}", block.Header().Hash());
           throw;
       }
   }
   ```
   
   **Why it matters:** Blockchain data often contains edge cases that can trigger exceptions - from unusual transaction formats to protocol changes. Specific error handling allows your indexer to continue operation despite encountering problematic data. Without proper error handling, a single malformed transaction could halt your entire indexing pipeline, potentially causing you to fall behind the chain tip. By handling specific error scenarios differently, you can create a robust system that degrades gracefully when it encounters issues rather than failing completely.

2. **Implement comprehensive health checks:**
   ```csharp
   // In Program.cs
   builder.Services.AddHealthChecks()
       .AddDbContextCheck<MyDbContext>("database")
       .AddCheck("node-connection", () => {
           // Check connection to Cardano node
           return HealthCheckResult.Healthy();
       })
       .AddCheck("indexer-sync-status", () => {
           // Check if we're within acceptable range of chain tip
           var syncStatus = syncStatusProvider.GetCurrentStatus();
           var blocksFromTip = syncStatus.ChainTip - syncStatus.LastIndexedBlock;
           
           if (blocksFromTip > 100)
               return HealthCheckResult.Degraded($"Indexer is {blocksFromTip} blocks behind chain tip");
               
           return HealthCheckResult.Healthy();
       });
       
   app.MapHealthChecks("/health");
   ```
   
   **Why it matters:** Blockchain indexers are complex systems with multiple dependencies - database connections, blockchain node access, and internal processing pipelines. Comprehensive health checks allow you to quickly identify component failures and take corrective action before they affect your users. They also enable automated monitoring and alerts, which are essential for production blockchain applications where downtime or data inconsistencies can have significant consequences.

3. **Auto-apply migrations:**
   ```csharp
   // In Program.cs, after building the app
   var app = builder.Build();

   // Apply migrations automatically at startup
   using IServiceScope scope = app.Services.CreateScope();
   MyDbContext dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
   dbContext.Database.Migrate();
   ```
   
   **Why it matters:** Auto-migration eliminates manual database update steps during deployment, ensuring your application always runs with the correct schema version. In blockchain applications where continuous uptime is crucial, this approach minimizes deployment risks and human error. It also simplifies your CI/CD pipeline by removing a step that could be overlooked during automated deployments. For development environments, it ensures that everyone on the team is always working with the latest database schema without requiring explicit migration commands.


### 🏃 Performance Optimization

1. **Use batch processing for large operations:**
   ```csharp
   public async Task ProcessLargeDataSetAsync(List<SomeData> dataItems)
   {
       const int batchSize = 100;
       for (int i = 0; i < dataItems.Count; i += batchSize)
       {
           var batch = dataItems.Skip(i).Take(batchSize);
           using var db = dbContextFactory.CreateDbContext();
           
           // Process batch
           foreach (var item in batch)
           {
               // Add to context without immediate save
               db.SomeItems.Add(new SomeItem(/* ... */));
           }
           
           // Save the entire batch at once
           await db.SaveChangesAsync();
       }
   }
   ```
   
   **Why it matters:** Blockchain data processing often involves handling thousands of transactions or state changes at once. Processing these in batches significantly reduces database round-trips and memory consumption. For example, when indexing a block with 500 transactions, saving each transaction individually could require 500 separate database operations. Batching these into groups of 100 reduces this to just 5 operations, dramatically improving throughput and reducing the load on your database server. This approach is especially critical for high-throughput chains or during catch-up synchronization when processing large volumes of historical data.

2. **Implement caching for frequently accessed data:**
   ```csharp
   // Add memory cache
   builder.Services.AddMemoryCache();
   
   // In a service
   public async Task<BlockInfo?> GetBlockBySlotAsync(ulong slot)
   {
       string cacheKey = $"block-slot-{slot}";
       
       // Try to get from cache first
       if (memoryCache.TryGetValue(cacheKey, out BlockInfo? block))
       {
           return block;
       }
       
       // Not in cache, get from database
       using var db = dbContextFactory.CreateDbContext();
       block = await db.Blocks.FirstOrDefaultAsync(b => b.Slot == slot);
       
       if (block != null)
       {
           // Add to cache with expiration
           memoryCache.Set(cacheKey, block, TimeSpan.FromMinutes(10));
       }
       
       return block;
   }
   ```
   
   **Why it matters:** Blockchain applications frequently need to access the same data repeatedly, such as recent blocks, popular addresses, or active protocol parameters. Implementing a memory cache for this frequently accessed data can reduce database load by 50-90% for common queries. Since blockchain data is immutable once confirmed, it's an ideal candidate for caching. This is particularly valuable for high-traffic APIs or explorer services where the same blocks, transactions, or addresses may be requested thousands of times. Strategic caching of even a small percentage of your most frequently accessed data can drastically improve overall system performance and user experience.

### 📡 Monitoring and Observability

1. **Implement comprehensive logging:**
   ```csharp
   // In Program.cs
   builder.Logging.AddConsole();
   builder.Logging.SetMinimumLevel(LogLevel.Information);
   
   // In a reducer
   public class MonitoredReducer(
       ILogger<MonitoredReducer> logger,
       IDbContextFactory<MyDbContext> dbContextFactory
   ) : IReducer<SomeModel>
   {
       public async Task RollForwardAsync(Block block)
       {
           logger.LogInformation("Processing block {Hash} at slot {Slot}", 
               block.Header().Hash(), 
               block.Header().HeaderBody().Slot());
           
           // Process block
           
           logger.LogInformation("Processed {TxCount} transactions in block {Hash}",
               block.TransactionBodies().Length,
               block.Header().Hash());
       }
   }
   ```
   
   **Why it matters:** Comprehensive logging is essential for blockchain applications due to their complex and deterministic nature. When processing fails on a specific transaction or block, detailed logs allow you to pinpoint exactly where and why things went wrong. Structured logging with contextual information (like block hashes and slot numbers) enables you to trace issues across your system and correlate events during debugging. This becomes invaluable during chain reorganizations or when investigating discrepancies between your indexed data and the actual blockchain state. Good logging practices also facilitate post-mortem analysis after production incidents, helping you understand what happened and prevent similar issues in the future.

2. **Track performance metrics:**
   ```csharp
   // Track processing time
   var stopwatch = Stopwatch.StartNew();
   
   // Process block
   
   stopwatch.Stop();
   logger.LogInformation("Block processing took {ElapsedMs}ms", stopwatch.ElapsedMilliseconds);
   
   // Consider adding structured metrics for dashboards
   metrics.RecordBlockProcessingTime(block.Header().Hash(), stopwatch.ElapsedMilliseconds);
   ```
   
   **Why it matters:** Performance metrics are crucial for maintaining a healthy blockchain indexing system that stays in sync with the network. By tracking key metrics like block processing time, transaction throughput, and database query latency, you can establish baseline performance and quickly detect degradation. These metrics enable you to identify bottlenecks in your application - whether they're in data processing, storage, or retrieval. In production environments, performance metrics help you make data-driven decisions about when to scale resources, optimize code paths, or refactor inefficient components. They also provide early warning signs of potential issues before they become critical, giving you time to address problems before users are affected.

## 🌟 Conclusion

Argus provides a powerful foundation for building Cardano blockchain applications. By following these best practices and exploring the example use cases, you can leverage Argus's capabilities to create robust, high-performance applications that deliver real value to your users.

<br/>

💡 Remember that the key to success with Argus is in how you model your data and implement your reducers. The historical and active table system offers an optimal architecture for blockchain data management, allowing for both high-performance queries and complete data integrity during chain reorganizations. Take the time to design your data architecture carefully, with consideration for the specific queries, operations, and performance characteristics your application will need to maintain as your blockchain data grows.

<br/>

🔄 Implement comprehensive monitoring to ensure your indexers stay in sync with the blockchain network. By balancing efficient data storage, robust error handling, and strategic performance optimizations, your Argus-based applications will be able to scale and adapt alongside the evolving Cardano ecosystem.