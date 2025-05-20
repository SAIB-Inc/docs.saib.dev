---
title: CBOR Deserialization
sidebar_position: 2
hide_title: true
---

![CBOR Deserialization](/img/docs/argus/core-concepts/reducer.webp)

**CBOR deserialization** is essential for working with on-chain data in Argus. It enables you to convert between Cardano's CBOR-encoded blockchain data and strongly-typed C# objects that your application can easily work with.

Argus leverages Chrysalis's robust CBOR serialization capabilities to make working with complex blockchain data straightforward and type-safe.

---

## Understanding CBOR in Cardano

Cardano uses CBOR (Concise Binary Object Representation) to serialize all blockchain data, including transactions, datums, and scripts. While Argus automatically deserializes the core blockchain structures, it doesn't know about your specific smart contract or application data structures.

To work with application-specific data (like smart contract datums), you need to:

1. Define C# types that map to your on-chain data structures
2. Apply CBOR serialization attributes to these types
3. Use Chrysalis's serialization tools to deserialize the data in your reducers

This guide introduces the basics of working with CBOR in Argus, focusing on common patterns you'll use in your indexers.

---

## Defining Custom Datum Types

When working with smart contracts, you'll often need to deserialize datum objects attached to UTXOs. Here's how to define your C# types to match your on-chain data structures.

### Example: SundaeSwap Liquidity Pool Datum

Consider a SundaeSwap liquidity pool smart contract with this Aiken type:

```rust
pub type PoolDatum {
  identifier: Ident,
  assets: (AssetClass, AssetClass),
  circulating_lp: Int,
  bid_fees_per_10_thousand: Int,
  ask_fees_per_10_thousand: Int,
  fee_manager: Option<multisig.MultisigScript>,
  market_open: Int,
  protocol_fees: Int,
}
```

To represent this in C#, define a record with CBOR attributes:

```csharp
using Chrysalis.Cbor.Serialization.Attributes;
using Chrysalis.Cbor.Types;

namespace Argus.Sync.Example.Models.Datums;

[CborSerializable]
[CborConstr(0)]  // Constructor tag for Aiken data types
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

The key elements here are:

- `[CborSerializable]` - Marks the class for CBOR serialization
- `[CborConstr(0)]` - Indicates this is a tagged constructor (common in Plutus/Aiken)
- `[CborOrder(n)]` - Specifies the order of fields in the CBOR encoding
- `CborBase` base class - Provides serialization infrastructure

### Supporting Types

Your datum might reference other complex types that also need CBOR mapping:

```csharp
[CborSerializable]
public partial record AssetClassTuple(
    [CborOrder(0)] AssetClass Asset1,
    [CborOrder(1)] AssetClass Asset2
);

[CborSerializable]
public partial record AssetClass(
    [CborOrder(0)] byte[] PolicyId,
    [CborOrder(1)] byte[] AssetName
);

[CborSerializable]
[CborConstr(0)]
public partial record MultisigScript(
    [CborOrder(0)] List<byte[]> RequiredSigners,
    [CborOrder(1)] int RequiredCount
);
```

---

## Deserializing Data in Reducers

Once you've defined your types, you can use them in your reducers to deserialize on-chain data.

### Example: Processing Liquidity Pool Data

Here's how to detect and deserialize SundaeSwap pool datums in a reducer:

```csharp
public async Task RollForwardAsync(Block block)
{
    ulong slot = block.Header().HeaderBody().Slot();
    await using var dbContext = _dbContextFactory.CreateDbContext();

    foreach (var tx in block.Body().TransactionBodies())
    {
        string txHash = tx.Hash();
        var outputs = tx.Outputs().ToList();

        for (int idx = 0; idx < outputs.Count; idx++)
        {
            var output = outputs[idx];
            
            // Try to deserialize the datum as a SundaeSwap pool datum
            if (TryDeserializeDatum(output, out SundaeSwapLiquidityPoolDatum datum))
            {
                // Create UTxO reference 
                string outRef = $"{txHash}#{idx}";
                
                // Process the datum and store in database
                var pool = new SundaeSwapPool
                {
                    Slot = slot,
                    Outref = outRef,
                    TxOutputRaw = output.Raw?.ToArray()!,
                    // Map fields from datum to your entity
                    Identifier = Convert.ToHexString(datum.Identifier),
                    Asset1 = Convert.ToHexString(datum.Assets.Asset1.PolicyId) + "." + 
                             Convert.ToHexString(datum.Assets.Asset1.AssetName),
                    Asset2 = Convert.ToHexString(datum.Assets.Asset2.PolicyId) + "." + 
                             Convert.ToHexString(datum.Assets.Asset2.AssetName),
                    CirculatingLp = datum.CirculatingLp,
                    BidFeesPer10Thousand = datum.BidFeesPer10Thousand,
                    AskFeesPer10Thousand = datum.AskFeesPer10Thousand,
                    MarketOpen = datum.MarketOpen > 0
                };

                dbContext.SundaeSwapPools.Add(pool);
            }
        }
    }

    await dbContext.SaveChangesAsync();
}
```

### Helper Method for Datum Deserialization

This helper method detects and deserializes datums for your specific script:

```csharp
private bool TryDeserializeDatum(TransactionOutput txOut, out SundaeSwapLiquidityPoolDatum datum)
{
    datum = default!;
    try
    {
        // Only process UTXOs for your specific script address
        var address = new WalletAddress(txOut.Address());
        var scriptHash = address.GetPaymentKeyHash() ?? Array.Empty<byte>();
        
        // Check if this output belongs to the contract we're interested in
        if (Convert.ToHexString(scriptHash).ToLowerInvariant() != _targetScriptHash)
            return false;

        // Get the datum from the output
        var datumOption = txOut.DatumOption();
        if (datumOption is null)
            return false;

        // Deserialize the datum
        var inlineDatum = new CborEncodedValue(datumOption.Data());
        
        // Option 1: Using generated reader method
        datum = SundaeSwapLiquidityPoolDatum.Read(inlineDatum.GetValue());
        
        // Option 2: Using the generic serializer
        // datum = CborSerializer.Deserialize<SundaeSwapLiquidityPoolDatum>(inlineDatum.GetValue());
        
        return datum is not null;
    }
    catch (Exception)
    {
        // Handle serialization errors gracefully - not all datums will match our expected format
        return false;
    }
}
```

---

## Working with CBOR Types

Chrysalis provides several useful types for working with CBOR data:

| Type | Description |
|------|-------------|
| `CborEncodedValue` | Wrapper for raw CBOR bytes with helper methods |
| `Option<T>` | Represents optional values (similar to Rust/Aiken Option) |
| `CborBase` | Base class that provides serialization functionality |

When your types are decorated with CBOR attributes, Chrysalis automatically generates strongly-typed serialization code during compilation, making CBOR handling much more reliable than manual approaches.

---

CBOR deserialization in Argus allows you to work with on-chain data in a type-safe, object-oriented way. By defining C# types that map to your on-chain data structures and using Chrysalis's serialization tools, you can easily process complex smart contract data without dealing with raw CBOR.

For more detailed information on working with CBOR in Chrysalis, refer to the [Chrysalis CBOR documentation](/docs/chrysalis/cbor/overview).