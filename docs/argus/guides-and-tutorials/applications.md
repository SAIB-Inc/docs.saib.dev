---
title: Applications
sidebar_position: 2
---

# ✨ Applications

This guide explores practical applications of Argus and provides best practices for integrating it into your Cardano blockchain projects. You'll discover real-world use cases and implementation patterns that leverage Argus's powerful indexing capabilities.

## 💻 Example Use Cases

Argus's flexible architecture makes it suitable for a wide range of blockchain applications. Here are some concrete examples with implementation details.

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

<details>
<summary><strong>How the Balance Tracker Works</strong></summary>

The `BalanceByAddressReducer` maintains accurate on-chain balances by:

- **Processing inputs and outputs**: Identifies addresses sending and receiving funds
- **Updating balances**: Adjusts lovelace and token amounts for each affected address
- **Handling rollbacks**: Reverts to previous states when chain reorganizations occur
- **Managing token accounting**: Tracks native assets with their policy IDs and names
</details>

:::tip Real-world Applications
A balance tracker serves as the foundation for:
- Wallet dashboards showing real-time assets
- Portfolio tracking applications
- Analytics tools monitoring wealth distribution
- Alert systems for significant balance movements
:::

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

:::info DEX Monitoring Capabilities
With this model structure, your application can:
- Track liquidity across multiple DEX protocols
- Calculate and compare swap prices in real-time
- Identify arbitrage opportunities between pools
- Monitor impermanent loss for liquidity providers
- Generate market depth charts for trading pairs
:::

#### How the DeFi Monitor Works

The `DexActivityReducer` captures the dynamic activity of decentralized exchanges by monitoring specific transaction patterns:

- **Protocol Detection**: Identifies DEX-related operations by analyzing transaction metadata and script execution
- **Pool Tracking**: Monitors creation events and liquidity changes across different protocols
- **Swap Analysis**: Records transaction details including amounts, direction, and price impact
- **Rollback Handling**: Maintains historical pool states to ensure accuracy during chain reorganizations

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

:::info NFT Tracking Features
With this approach, you can build features that enable users to:
- Track floor prices and sales velocity for collections
- Analyze market trends and trading volumes
- Monitor whale activity in the NFT space
- Build price history and provenance records
:::

## 💪 Best Practices for Integrating Argus

### 💾 Efficient Database Design

**Optimize your data models:**
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

:::tip Strategic Indexing
Blockchain data grows continuously, making proper indexing crucial:
- Indexes on frequently filtered fields improve query performance dramatically
- Composite indexes optimize common query patterns (like address + time range)
- Without proper indexing, performance degrades as your database expands
:::

**Implement historical and active table system:**
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

:::info Dual-Table Architecture Benefit
The historical and active table system provides an optimal architecture for blockchain data:

- **Active tables** contain only the current state, making read operations extremely fast
- **Historical tables** store every change with slot information, enabling precise reconstruction of past states
- This approach ensures both high-performance queries and reliable rollback handling
:::

**Implement data pruning strategies:**
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

:::tip Data Lifecycle Management
Even with perfect indexing, databases eventually face performance and storage challenges. Consider:

- **Time-based pruning**: Keep detailed recent data, summary data for older periods
- **Aggregation**: Convert high-frequency data points to period summaries
- **Selective retention**: Keep important transactions, prune routine operations
- **Cold storage**: Move older data to lower-cost storage solutions
:::

### 🗼 Resilient Application Design

**Implement specific error handling:**
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

:::caution Error Handling Strategy
Blockchain data often contains edge cases and anomalies. Specific error handling allows your indexer to:

- Continue operation despite encountering problematic transactions
- Degrade gracefully rather than failing completely
- Process the majority of valid data even when some items cause exceptions
- Create detailed logs for diagnosing and fixing underlying issues
:::

**Implement comprehensive health checks:**
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

:::info Key Health Metrics
Monitor these critical indicators for indexer health:
- **Sync distance**: Blocks behind the network tip
- **Database connection**: Connection status and latency
- **Node connection**: Reliability and response time
- **Processing throughput**: Blocks/transactions per second
- **Resource utilization**: CPU, memory, and disk usage
:::

**Auto-apply migrations:**
   ```csharp
   // In Program.cs, after building the app
   var app = builder.Build();

   // Apply migrations automatically at startup
   using IServiceScope scope = app.Services.CreateScope();
   MyDbContext dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
   dbContext.Database.Migrate();
   ```

:::tip Deployment Simplification
Auto-migration eliminates manual database update steps during deployment, ensuring your application always runs with the correct schema version. This approach:

- Minimizes deployment risks and human error
- Simplifies CI/CD pipelines
- Ensures consistent database states across environments
- Reduces downtime during updates
:::

### 🏃 Performance Optimization

**Use batch processing for large operations:**
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

:::info Batch Processing Benefits
Process blockchain data more efficiently by:
- **Reducing round-trips**: Fewer database operations means better throughput
- **Optimizing transactions**: Group related changes in single transactions
- **Managing memory**: Control resource usage during large data processing 
- **Improving throughput**: Process hundreds of operations in a few batches
:::

**Implement caching for frequently accessed data:**
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

:::info Caching Strategy
Blockchain data is immutable once confirmed, making it ideal for caching:

- Reduces database load by 50-90% for common queries 
- Dramatically improves API response times
- Supports higher request throughput without scaling database resources
- Prioritize caching recent blocks, popular addresses, and token metadata
:::

### 📡 Monitoring and Observability

**Implement comprehensive logging:**
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

:::tip Effective Logging
Focus your logging strategy on these key elements:
- **Block context**: Include hash and slot for traceability
- **Performance metrics**: Log processing time for operations
- **Transaction details**: Record counts and key statistics
- **Error conditions**: Capture full context when exceptions occur
- **State changes**: Document transitions in synchronization status
:::

**Track performance metrics:**
   ```csharp
   // Track processing time
   var stopwatch = Stopwatch.StartNew();
   
   // Process block
   
   stopwatch.Stop();
   logger.LogInformation("Block processing took {ElapsedMs}ms", stopwatch.ElapsedMilliseconds);
   
   // Consider adding structured metrics for dashboards
   metrics.RecordBlockProcessingTime(block.Header().Hash(), stopwatch.ElapsedMilliseconds);
   ```

:::tip Key Performance Indicators
Monitor these critical metrics to ensure your indexer performs optimally:

- **Block processing time**: How long it takes to process each block
- **Transactions per second**: Your system's throughput rate
- **Distance from chain tip**: How many blocks behind the network you are
- **Query latency**: Response time for common API operations
- **Resource utilization**: CPU, memory, disk, and network usage trends
:::

## 🌟 Advanced Implementation Patterns

### Multi-Tier Data Architecture

For production blockchain applications, consider implementing a multi-tier data architecture:

```
                  ┌─────────────────┐
                  │   Hot Tier      │
                  │ (Recent Data)   │
                  └────────┬────────┘
                           │
                           ▼
┌─────────────────┐  ┌─────────────────┐
│  Analytics Tier │  │    Warm Tier    │
│ (Aggregations)  │◄─┤ (Historical)    │
└─────────────────┘  └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │    Cold Tier    │
                     │  (Archival)     │
                     └─────────────────┘
```

:::info Data Tiering Benefits
- **Hot Tier**: Contains current state and recent history for fast access
- **Warm Tier**: Stores medium-term history with balanced performance and cost
- **Cold Tier**: Archives older data with lower access frequency
- **Analytics Tier**: Maintains pre-aggregated views for reporting and analysis
:::

### Event-Driven Architecture

For real-time applications, implement an event-driven architecture that broadcasts blockchain events:

```csharp
// In your reducer
public async Task RollForwardAsync(Block block)
{
    // Process block data
    
    // Emit events for interested subscribers
    foreach (var tx in block.TransactionBodies())
    {
        // Check for specific patterns
        if (IsNftSale(tx))
        {
            var saleEvent = ExtractNftSaleDetails(tx);
            await eventPublisher.PublishAsync("nft.sale", saleEvent);
        }
        
        if (IsDexSwap(tx))
        {
            var swapEvent = ExtractSwapDetails(tx);
            await eventPublisher.PublishAsync("dex.swap", swapEvent);
        }
    }
}
```

This pattern enables:
- Push notifications for wallet activity
- Real-time trading dashboards
- Live market data feeds
- Webhook integrations with external systems

## 🌟 Conclusion

Argus provides a powerful foundation for building Cardano blockchain applications. By following these best practices and exploring the example use cases, you can leverage Argus's capabilities to create robust, high-performance applications that deliver real value to your users.

The historical and active table system offers an optimal architecture for blockchain data management, allowing for both high-performance queries and complete data integrity during chain reorganizations. Take the time to design your data architecture carefully, with consideration for the specific queries, operations, and performance characteristics your application needs.

:::tip Production Readiness Checklist
For enterprise blockchain applications using Argus, ensure you've implemented:

- ✅ Comprehensive error handling for blockchain edge cases
- ✅ Strategic data tiering for performance and cost optimization
- ✅ Monitoring dashboards with key performance indicators
- ✅ Automated health checks and alerts
- ✅ Scalable database design with proper indexing
- ✅ Deployment automation with CI/CD integration
:::

Implement comprehensive monitoring to ensure your indexers stay in sync with the blockchain network. By balancing efficient data storage, robust error handling, and strategic performance optimizations, your Argus-based applications will be able to scale and adapt alongside the evolving Cardano ecosystem.