---
title: SundaeSwap Liquidity Pool Reducer
sidebar_label: SundaeSwap Reducer
sidebar_position: 2
---

This example walks through building a reducer that indexes SundaeSwap liquidity pool UTxOs.

## 1. Define Data Models

### 1.1 AssetClass and AssetClassTuple

```csharp
using Chrysalis.Cbor.Serialization.Attributes;
using Chrysalis.Cbor.Types;

[CborSerializable]
[CborList]
public partial record AssetClass(
    [CborOrder(0)] byte[] PolicyId,
    [CborOrder(1)] byte[] AssetName
) : CborBase;

[CborSerializable]
[CborList]
public partial record AssetClassTuple(
    [CborOrder(0)] AssetClass AssetX,
    [CborOrder(1)] AssetClass AssetY
) : CborBase;
```

### 1.2 MultisigScript

```csharp
using Chrysalis.Cbor.Serialization.Attributes;
using Chrysalis.Cbor.Types.Cardano.Core.Common;

[CborSerializable]
[CborUnion]
public abstract partial record MultisigScript : CborBase;

[CborSerializable]
[CborConstr(0)]
public partial record Signature([CborOrder(0)] byte[] KeyHash) : MultisigScript;

[CborSerializable]
[CborConstr(1)]
public partial record AllOf([CborOrder(0)] CborIndefList<MultisigScript> Scripts) : MultisigScript;

[CborSerializable]
[CborConstr(2)]
public partial record AnyOf([CborOrder(0)] CborIndefList<MultisigScript> Scripts) : MultisigScript;

[CborSerializable]
[CborConstr(3)]
public partial record AtLeast(
    [CborOrder(0)] ulong Required,
    [CborOrder(1)] CborIndefList<MultisigScript> Scripts
) : MultisigScript;

[CborSerializable]
[CborConstr(4)]
public partial record Before([CborOrder(0)] PosixTime Time) : MultisigScript;

[CborSerializable]
[CborConstr(5)]
public partial record After([CborOrder(0)] PosixTime Time) : MultisigScript;

[CborSerializable]
[CborConstr(6)]
public partial record Script([CborOrder(0)] byte[] ScriptHash) : MultisigScript;
```

### 1.3 Datum Type

```csharp
using Chrysalis.Cbor.Serialization.Attributes;
using Chrysalis.Cbor.Types;

[CborSerializable]
[CborConstr(0)]
public partial record SundaeSwapLiquidityPoolDatum(
    [CborOrder(0)] byte[] Identifier,
    [CborOrder(1)] AssetClassTuple Assets,
    [CborOrder(2)] ulong CirculatingLp,
    [CborOrder(3)] ulong BidFeesPer10Thousand,
    [CborOrder(4)] ulong AskFeesPer10Thousand,
    [CborOrder(5)] Option<MultisigScript> FeeManager,
    [CborOrder(6)] ulong MarketOpen,
    [CborOrder(7)] ulong ProtocolFees
) : CborBase;
```

### 1.4 Entity Model

```csharp
using System.ComponentModel.DataAnnotations.Schema;
using Argus.Sync.Data.Models;
using Chrysalis.Cbor.Types.Cardano.Core.Transaction;

public record SundaeSwapLiquidityPool(
    ulong Slot,
    string Outref,
    string Identifier,
    string AssetX,
    string AssetY,
    string Pair,
    string LpToken,
    ulong CirculatingLp,
    byte[] TxOutputRaw
) : IReducerModel
{
    [NotMapped]
    public TransactionOutput TxOutput => TransactionOutput.Read(TxOutputRaw);

    [NotMapped]
    public SundaeSwapLiquidityPoolDatum Datum =>
        SundaeSwapLiquidityPoolDatum.Read(TxOutput.DatumOption()!.Data());
}
```

## 2. Database Context

Extend `CardanoDbContext` to include your entity:

```csharp
using Argus.Sync.Data;
using Argus.Sync.Example.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext(
    DbContextOptions<AppDbContext> options,
    IConfiguration configuration
) : CardanoDbContext(options, configuration)
{
    public DbSet<SundaeSwapLiquidityPool> SundaeSwapLiquidityPools => Set<SundaeSwapLiquidityPool>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SundaeSwapLiquidityPool>(entity =>
        {
            entity.HasKey(e => new { e.Identifier, e.Outref });
        });
    }
}
```

## 3. Implement the Reducer

```csharp
using System.Text;
using Argus.Sync.Example.Models;
using Argus.Sync.Example.Models.Datums;
using Argus.Sync.Extensions;
using Argus.Sync.Reducers;
using Chrysalis.Cbor.Extensions.Cardano.Core;
using Chrysalis.Cbor.Extensions.Cardano.Core.Transaction;
using Chrysalis.Cbor.Types.Cardano.Core.Transaction;
using WalletAddress = Chrysalis.Wallet.Models.Addresses.Address;

public class SundaeSwapReducer(
    IDbContextFactory<AppDbContext> dbContextFactory
) : IReducer<SundaeSwapLiquidityPool>
{
    private readonly string _scriptHash = "e0302560ced2fdcbfcb2602697df970cd0d6a38f94b32703f51c312b";

    public async Task RollBackwardAsync(ulong slot)
    {
        using var db = dbContextFactory.CreateDbContext();
        var toRemove = db.SundaeSwapLiquidityPools.Where(p => p.Slot >= slot);
        db.RemoveRange(toRemove);
        await db.SaveChangesAsync();
    }

    public async Task RollForwardAsync(Block block)
    {
        ulong slot = block.Header().HeaderBody().Slot();
        using var db = dbContextFactory.CreateDbContext();

        foreach (var tx in block.TransactionBodies())
        {
            string txHash = tx.Hash();
            var outputs = tx.Outputs().ToList();

            for (int i = 0; i < outputs.Count; i++)
            {
                var output = outputs[i];
                if (TryDeserializeDatum(output, out var datum))
                {
                    var outRef = $"{txHash}#{i}";
                    var entity = ParseLiquidityPool(datum) with { Slot = slot, Outref = outRef, TxOutputRaw = output.Raw?.ToArray()! };
                    db.SundaeSwapLiquidityPools.Add(entity);
                }
            }
        }

        await db.SaveChangesAsync();
    }

    private bool TryDeserializeDatum(TransactionOutput txOut, out SundaeSwapLiquidityPoolDatum datum)
    {
        datum = default!;
        try
        {
            var address = new WalletAddress(txOut.Address());
            var hash = address.GetPaymentKeyHash() ?? Array.Empty<byte>();
            if (Convert.ToHexString(hash).ToLowerInvariant() != _scriptHash)
                return false;

            var option = txOut.DatumOption();
            if (option is null) return false;

            var inline = new CborEncodedValue(option.Data());
            datum = SundaeSwapLiquidityPoolDatum.Read(inline.GetValue());
            return datum is not null;
        }
        catch { return false; }
    }

    private static SundaeSwapLiquidityPool ParseLiquidityPool(SundaeSwapLiquidityPoolDatum d)
    {
        string id = Convert.ToHexString(d.Identifier).ToLowerInvariant();
        var (x, y) = (d.Assets.AssetX, d.Assets.AssetY);
        string assetX = $"{Convert.ToHexString(x.PolicyId).ToLowerInvariant()}.{Convert.ToHexString(x.AssetName).ToLowerInvariant()}";
        string assetY = $"{Convert.ToHexString(y.PolicyId).ToLowerInvariant()}.{Convert.ToHexString(y.AssetName).ToLowerInvariant()}";
        string pair = assetX + "/" + assetY;
        return new SundaeSwapLiquidityPool(
            Slot: 0,
            Outref: string.Empty,
            Identifier: id,
            AssetX: assetX,
            AssetY: assetY,
            Pair: pair,
            LpToken: id,
            CirculatingLp: d.CirculatingLp,
            TxOutputRaw: Array.Empty<byte>()
        );
    }
}
```

## 4. Register in `Program.cs`

```csharp
builder.Services.AddCardanoIndexer<AppDbContext>(builder.Configuration);
builder.Services.AddReducers<AppDbContext, IReducerModel>(builder.Configuration);
```

## 5. Create migrations, build, and run

After registering services, generate the initial schema and start the application:

```bash
# Create migration for your reducer tables
dotnet ef migrations add InitialSundaeSwap
# Apply the migration to PostgreSQL
dotnet ef database update

# Build and run in Release mode
dotnet build
dotnet run -c Release
```

With the app running, Argus will connect to the Cardano node, process blocks, and populate your `SundaeSwapLiquidityPool` table based on incoming UTxOs.

## 6. Expose a Prices API

You can now expose an HTTP endpoint to fetch latest pool prices. First, implement the service:

```csharp
using System.Text;
using Argus.Sync.Example.Api;
using Argus.Sync.Data.Models;
using Argus.Sync.Example.Models;
using Microsoft.EntityFrameworkCore;
using Chrysalis.Cbor.Extensions.Cardano.Core.Transaction;

namespace Argus.Sync.Example.Api;

public class SundaeSwapService(IDbContextFactory<AppDbContext> dbContextFactory)
{
    public async Task<object> FetchPricesAsync(int limit = 10, string? pair = null)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync();
        var query = dbContext.SundaeSwapLiquidityPools.AsNoTracking();

        if (!string.IsNullOrEmpty(pair))
            query = query.Where(p => p.Pair == pair);

        var pools = await query
            .OrderByDescending(p => p.Slot)
            .Take(limit)
            .ToListAsync();

        return pools.Select(lp =>
        {
            var output = lp.TxOutput;
            ulong assetXReserve = output.Amount().QuantityOf(lp.AssetX.Replace(".", ""));
            ulong assetYReserve = output.Amount().QuantityOf(lp.AssetY.Replace(".", ""));
            return new
            {
                lp.Slot,
                lp.Pair,
                PriceByAssetX = (decimal)assetYReserve / assetXReserve,
                PriceByAssetY = (decimal)assetXReserve / assetYReserve
            };
        });
    }
}
```

Then register and map the endpoint in `Program.cs`:

```csharp
// in Program.cs
builder.Services.AddScoped<SundaeSwapService>();
// after app build
app.MapGet("/sundae/prices", async (SundaeSwapService svc, int limit, string? pair) =>
{
    var result = await svc.FetchPricesAsync(limit, pair);
    return Results.Ok(result);
});
```

### Example Request

```bash
curl "http://localhost:5000/sundae/prices?limit=5&pair=ada/xyz"
```

### Example Response

```json
[
  {
    "slot": 148000123,
    "pair": "ada/xyz",
    "priceByAssetX": 1.234,
    "priceByAssetY": 0.81
  }
]
```

This endpoint returns the latest `limit` price quotes for a given pool pair.
