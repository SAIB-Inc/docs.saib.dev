---
title: Usage Guide
sidebar_position: 2
---

# Usage Guide

## Defining Types

Every CBOR-serializable type needs three things:

1. The `[CborSerializable]` attribute (or `[PlutusData(N)]` shorthand)
2. A `partial` modifier (so the source generator can extend it)
3. A base class: `CborRecord` for records, or `ICborType` for structs

```csharp
using Chrysalis.Codec.Serialization.Attributes;
using Chrysalis.Codec.Types;

[CborSerializable]
[CborList]
public partial record TransactionInput(
    [CborOrder(0)] ReadOnlyMemory<byte> TransactionId,
    [CborOrder(1)] uint Index
) : CborRecord;
```

---

## Structure Types

### List (Array)

Serialize as an ordered CBOR array. Use `[CborOrder(N)]` to set field positions.

```csharp
[CborSerializable]
[CborList]
public partial record TransactionInput(
    [CborOrder(0)] ReadOnlyMemory<byte> TransactionId,
    [CborOrder(1)] uint Index
) : CborRecord;
```

### Map (Dictionary)

Serialize as a CBOR map with explicit keys. Use `[CborProperty(key)]` for each field.

```csharp
[CborSerializable]
[CborMap]
public partial record TransactionBody(
    [CborProperty(0)] ICborMaybeIndefList<TransactionInput> Inputs,
    [CborProperty(1)] ICborMaybeIndefList<ITransactionOutput> Outputs,
    [CborProperty(2)] ulong Fee
) : CborRecord;
```

### Constructor (Plutus Data)

Serialize as a CBOR constructor with a tag index. This is how Plutus datums and redeemers are encoded on Cardano.

```csharp
[CborSerializable]
[CborConstr(0)]
public partial record MyDatum(
    [CborOrder(0)] PlutusBoundedBytes Owner,
    [CborOrder(1)] IPlutusBigInt Amount
) : CborRecord;
```

**Shorthand:** `[PlutusData(N)]` combines `[CborSerializable]` and `[CborConstr(N)]`:

```csharp
[PlutusData(0)]
public partial record MyDatum(
    [CborOrder(0)] PlutusBoundedBytes Owner,
    [CborOrder(1)] IPlutusBigInt Amount
) : CborRecord;
```

### Union (Discriminated)

Define an interface with `[CborUnion]`, then implement variants with specific constructor indices:

```csharp
[CborSerializable]
[CborUnion]
public abstract partial record MyRedeemer : CborRecord;

[PlutusData(0)]
public partial record Spend([CborOrder(0)] long OutputIndex) : MyRedeemer;

[PlutusData(1)]
public partial record Cancel() : MyRedeemer;
```

### Tagged

Prepend a CBOR semantic tag:

```csharp
[CborSerializable]
[CborTag(30)]
[CborList]
public partial record CborRationalNumber(
    [CborOrder(0)] ulong Numerator,
    [CborOrder(1)] ulong Denominator
) : CborRecord;
```

---

## Encoding Control

| Attribute | Effect |
|---|---|
| `[CborIndefinite]` | Use indefinite-length CBOR arrays (standard for Plutus data) |
| `[CborDefinite]` | Force definite-length CBOR arrays |
| `[CborSize(N)]` | Split byte strings into N-byte chunks |

---

## Serialization

### Using CborSerializer (recommended)

```csharp
using Chrysalis.Codec.Serialization;

// Serialize
byte[] cbor = CborSerializer.Serialize(myValue);

// Deserialize
MyType decoded = CborSerializer.Deserialize<MyType>(cbor);
```

### Using Create() factories

Every type gets a source-generated `Create()` method that constructs a value with valid CBOR backing:

```csharp
var input = TransactionInput.Create(txIdBytes, 0);
var rational = CborRationalNumber.Create(3, 4);
```

### Using Read/Write directly

Each type also has static `Read` and `Write` methods for lower-level control:

```csharp
// Read from CBOR bytes
MyType value = MyType.Read(data, out int bytesConsumed);

// Write to a buffer
var buffer = new ArrayBufferWriter<byte>();
MyType.Write(buffer, value);
```

---

## Attribute Reference

| Attribute | Description |
|---|---|
| `[CborSerializable]` | Marks a type for source-generated CBOR serialization |
| `[PlutusData(N)]` | Shorthand for `[CborSerializable]` + `[CborConstr(N)]` |
| `[CborList]` | Serialize as a CBOR array |
| `[CborMap]` | Serialize as a CBOR map |
| `[CborUnion]` | Base type for discriminated unions |
| `[CborTag(N)]` | Prepend a CBOR semantic tag |
| `[CborConstr]` / `[CborConstr(N)]` | Serialize as a Plutus constructor |
| `[CborOrder(N)]` | Field position in arrays |
| `[CborProperty(key)]` | Key for map entries |
| `[CborIndefinite]` | Use indefinite-length encoding |
| `[CborDefinite]` | Use definite-length encoding |
| `[CborSize(N)]` | Fixed-size byte string chunks |
