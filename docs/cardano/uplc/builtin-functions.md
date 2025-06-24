---
title: Built-in Functions
sidebar_position: 4
---

# Built-in Functions

Built-in functions are the computational workhorses of UPLC. These natively implemented operations provide efficient implementations of common operations that would be impossible or prohibitively expensive to implement in pure UPLC.

---

## Why Built-ins Matter

Built-in functions exist for three critical reasons:

1. **Performance**: Native implementations are orders of magnitude faster than UPLC equivalents
2. **Capabilities**: Some operations (like cryptographic functions) require system-level access
3. **Cost Predictability**: Fixed costs for built-ins make transaction fees calculable

Every built-in has a precisely defined cost model, ensuring that transaction fees remain predictable regardless of network conditions.

---

## Arithmetic Operations

### Integer Arithmetic

UPLC provides standard arithmetic operations for its arbitrary-precision integers:

```
addInteger : integer -> integer -> integer
subtractInteger : integer -> integer -> integer  
multiplyInteger : integer -> integer -> integer
divideInteger : integer -> integer -> integer
quotientInteger : integer -> integer -> integer
remainderInteger : integer -> integer -> integer
modInteger : integer -> integer -> integer
```

The distinction between `divideInteger`, `quotientInteger`, and `modInteger` follows mathematical conventions:
- `divideInteger` performs truncated division toward negative infinity
- `quotientInteger` truncates toward zero
- `remainderInteger` gives the remainder after `quotientInteger`
- `modInteger` gives the remainder after `divideInteger`

### Integer Comparison

Comparison operations return boolean values:

```
equalsInteger : integer -> integer -> bool
lessThanInteger : integer -> integer -> bool
lessThanEqualsInteger : integer -> integer -> bool
```

You can derive other comparisons from these primitives. For example, "greater than" is just "less than" with swapped arguments.

---

## String and Bytestring Operations

### String Manipulation

```
appendString : string -> string -> string
equalsString : string -> string -> bool
encodeUtf8 : string -> bytestring
```

String operations are limited because strings are intended for human-readable data, not computation. Most text processing should happen off-chain.

### Bytestring Operations

```
appendByteString : bytestring -> bytestring -> bytestring
consByteString : integer -> bytestring -> bytestring
sliceByteString : integer -> integer -> bytestring -> bytestring
lengthOfByteString : bytestring -> integer
indexByteString : bytestring -> integer -> integer
equalsByteString : bytestring -> bytestring -> bool
lessThanByteString : bytestring -> bytestring -> bool
lessThanEqualsByteString : bytestring -> bytestring -> bool
```

Bytestrings support more operations because they're the primary type for binary data manipulation. The `consByteString` function prepends a single byte (as an integer 0-255) to a bytestring.

### Conversion

```
decodeUtf8 : bytestring -> string
```

This function can fail if the bytestring contains invalid UTF-8 sequences, making it one of the few built-ins that can cause runtime errors beyond type mismatches.

---

## Cryptographic Functions

### Hash Functions

UPLC supports three cryptographic hash functions, each producing a fixed-size bytestring output:

```
sha2_256 : bytestring -> bytestring         -- 32 bytes output
sha3_256 : bytestring -> bytestring         -- 32 bytes output  
blake2b_256 : bytestring -> bytestring      -- 32 bytes output
blake2b_224 : bytestring -> bytestring      -- 28 bytes output
keccak_256 : bytestring -> bytestring       -- 32 bytes output
```

These functions are essential for verifying data integrity and implementing cryptographic protocols.

### Digital Signatures

UPLC supports three signature schemes used across the blockchain ecosystem:

```
verifyEd25519Signature : bytestring -> bytestring -> bytestring -> bool
verifyEcdsaSecp256k1Signature : bytestring -> bytestring -> bytestring -> bool
verifySchnorrSecp256k1Signature : bytestring -> bytestring -> bytestring -> bool
```

All signature verification functions take three arguments:
1. Public key (as bytestring)
2. Message (as bytestring)  
3. Signature (as bytestring)

They return `True` if the signature is valid, `False` otherwise. These functions never throw errors—invalid inputs simply return `False`.

---

## Data Structure Operations

### List Operations

```
headList : list<a> -> a
tailList : list<a> -> list<a>
nullList : list<a> -> bool
mkCons : a -> list<a> -> list<a>
```

These functions provide basic list manipulation. Note that `headList` and `tailList` will error on empty lists—always check with `nullList` first when the list might be empty.

### Pair Operations

```
fstPair : pair<a,b> -> a
sndPair : pair<a,b> -> b
mkPairData : data -> data -> pair<data,data>
```

Pair access is constant time, making pairs efficient for fixed-size data structures.

### Data Type Conversions

```
iData : integer -> data
unIData : data -> integer
bData : bytestring -> data
unBData : data -> bytestring
constrData : integer -> list<data> -> data
unConstrData : data -> pair<integer, list<data>>
mapData : list<pair<data,data>> -> data
unMapData : data -> list<pair<data,data>>
listData : list<data> -> data
unListData : data -> list<data>
equalsData : data -> data -> bool
```

These functions convert between UPLC's primitive types and the Data type used for datum and redeemer values. The `un*` versions will error if given Data of the wrong constructor type.

---

## Control Flow

### Conditional Execution

```
ifThenElse : bool -> a -> a -> a
```

This is UPLC's only branching primitive. Both branches are provided as arguments, but only the selected branch is evaluated (lazy evaluation).

### Error Handling

```
trace : string -> a -> a
```

The `trace` function outputs a string (for debugging) and returns its second argument. In production, traces are typically disabled for efficiency. When enabled, trace outputs appear in transaction validation logs.

---

## Special Operations

### Type-Level Operations

```
chooseUnit : unit -> a -> a
chooseList : list<a> -> b -> b -> b
chooseData : data -> a -> a -> a -> a -> a -> a
```

These functions provide type-case analysis, branching based on the shape of data structures. They're primarily used in generic programming patterns.

### Serialization

```
serialiseData : data -> bytestring
```

Converts Data values to their canonical CBOR encoding. This is essential for computing hashes of structured data in a deterministic way.

---

## Working with Built-ins

When using built-in functions, remember:

1. **Type Sensitivity**: Built-ins enforce their type signatures strictly. Type mismatches cause immediate validation failure.

2. **Cost Awareness**: Each built-in has a specific cost. Cryptographic operations are expensive; simple arithmetic is cheap.

3. **Error Behavior**: Most built-ins that can fail (like `unIData` or `headList`) do so immediately. There's no error recovery.

4. **Evaluation Order**: Built-ins evaluate their arguments left-to-right before executing.

---

## Example: Signature Verification

Here's a complete example verifying an Ed25519 signature:

```
(program 2.0.0
  (lam pubKey
    (lam message  
      (lam signature
        [ [ [ (builtin verifyEd25519Signature) pubKey ] message ] signature ]
      )
    )
  )
)
```

This program takes three bytestring arguments and returns a boolean indicating signature validity.

---

## Performance Guidelines

For optimal performance:

- **Minimize cryptographic operations**: They're the most expensive built-ins
- **Prefer bytestrings over strings**: Bytestring operations are more efficient
- **Use arithmetic sparingly**: Each operation has a cost
- **Batch operations when possible**: Reduce the total number of built-in calls

Understanding built-in functions and their costs is essential for writing efficient smart contracts that minimize transaction fees while maintaining security and correctness.

---