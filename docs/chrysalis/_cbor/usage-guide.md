---
title: Usage Guide
sidebar_position: 2
---

## Basic Requirements

To serialize your types using Chrysalis.Cbor, each type must meet these criteria:

1. **Use the `[CborSerializable]` attribute** – Enables source generation for CBOR serialization.
2. **Inherit from `CborBase`** – Offers common serialization methods and hooks.
3. **Declare as `partial record`** – Permits automatic extension of your types via source generators.

```csharp
using Chrysalis.Cbor.Serialization.Attributes;
using Chrysalis.Cbor.Types;

[CborSerializable]
public partial record MyCardanoType(int Value) : CborBase;
```

---

## CBOR Structure Types

Chrysalis.Cbor provides built-in types covering most Cardano data structures as defined in the official [CDDL](https://github.com/IntersectMBO/cardano-ledger/blob/master/eras/conway/impl/cddl-files/conway.cddl). You can refer to this document for a detailed specification and as a reference when creating your own types. Additionally, it supports diverse custom data modeling patterns to fit your specific use case:
### List (Array) Types

Mark records with `[CborList]` and `[CborOrder]` to define ordered CBOR arrays.

```csharp
[CborSerializable]
[CborList]
public partial record TransactionInput(
  [CborOrder(0)] byte[] TransactionId,
  [CborOrder(1)] ulong Index
) : CborBase;
```

### Map (Dictionary) Types

Apply `[CborMap]` and `[CborProperty]` to serialize records as CBOR maps with explicit key-value pairs.

```csharp
[CborSerializable]
[CborMap]
public partial record BabbageTransactionBody(
  [CborProperty(0)] CborMaybeIndefList<TransactionInput> Inputs,
  [CborProperty(1)] CborMaybeIndefList<TransactionOutput> Outputs,
  [CborProperty(2)] ulong Fee
) : CborBase, ICborPreserveRaw;
```

### Union Types

Define abstract base classes with `[CborUnion]`, then specify derived variants:

```csharp
[CborSerializable]
[CborUnion]
public abstract partial record TransactionOutput : CborBase { }

[CborSerializable]
[CborList]
public partial record AlonzoTransactionOutput(
  [CborOrder(0)] Address Address,
  [CborOrder(1)] Value Amount,
  [CborOrder(2)] byte[]? DatumHash
) : TransactionOutput;
```

### Tagged Types

Include a numeric tag in serialized data using `[CborTag(n)]`:

```csharp
[CborSerializable]
[CborTag(30)]
[CborList]
public partial record CborRationalNumber(
  [CborOrder(0)] ulong Numerator,
  [CborOrder(1)] ulong Denominator
) : CborBase;
```

### Constructor Types

Serialize constructor-like data structures with `[CborConstr]` or `[CborConstr(index)]`:

```csharp
[CborSerializable]
[CborConstr(0)]
public partial record Some<T>([CborOrder(0)] T Value) : Option<T>;
```

---

## Attribute Quick Reference

| Attribute                          | Description                                                 |
|------------------------------------|-------------------------------------------------------------|
| `[CborSerializable]`               | Marks a type for CBOR serialization                         |
| `[CborList]`                       | Serializes type as a CBOR array                             |
| `[CborMap]`                        | Serializes type as a CBOR map                               |
| `[CborUnion]`                      | Base type for creating CBOR unions                          |
| `[CborTag(int)]`                   | Prepends a numeric CBOR tag                                 |
| `[CborConstr]` / `[CborConstr(int)]` | Serializes constructor-like data                            |
| `[CborOrder(int)]`                 | Sets element order in CBOR arrays                           |
| `[CborProperty(key)]`              | Defines key for CBOR map entries                            |
| `[CborNullable]`                   | Allows serialization of null values as CBOR null            |
| `[CborIndefinite]`                 | Supports indefinite-length CBOR collections                 |
| `[CborSize(int)]`                  | Splits byte arrays into fixed-size chunks                   |

---

## Usage Examples

### Simple Serialization

```csharp
[CborSerializable]
public partial record Person(
  [CborProperty(0)] string Name,
  [CborProperty(1)] int Age
) : CborBase;

var alice = new Person("Alice", 30);
byte[] data = CborSerializer.Serialize(alice);

Person copy = CborSerializer.Deserialize<Person>(data);
```

### Collections

```csharp
[CborSerializable]
[CborList]
public partial record Order(
  [CborOrder(0)] int Id,
  [CborOrder(1)] CborMaybeIndefList<string> Items
) : CborBase;

var order = new Order(42, new CborIndefList<string>(new[] { "apple", "banana" }));
byte[] cbor = CborSerializer.Serialize(order);
```

### Advanced Validation

```csharp
public class PositiveIntValidator : ICborValidator<PositiveIntContainer>
{
    public bool Validate(PositiveIntContainer container)
        => container.Value > 0 && container.Value <= 100;
}
```

---

