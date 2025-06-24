---
title: Data Types
sidebar_position: 3
---

# Data Types

UPLC supports seven primitive data types that form the foundation of all on-chain computations. Understanding these types and their behavior is crucial for writing efficient smart contracts and debugging validation failures.

---

## The Type System Paradox

Despite being called "Untyped" Plutus Core, UPLC values are implicitly typed. The "untyped" designation means there's no compile-time type checking—types are erased from the high-level language during compilation. However, at runtime, operations still expect specific types and will fail if given incompatible values.

This design keeps on-chain execution simple and predictable while pushing type safety to the compilation phase where it doesn't cost transaction fees.

---

## Primitive Types

### Unit

The unit type represents the absence of meaningful data, similar to `void` in other languages. It has exactly one value: `()`.

```
(con unit ())
```

Unit is commonly used as the return type for validator scripts, where success is indicated by returning `()` and failure by producing an error.

### Boolean

Booleans represent truth values with exactly two possible values:

```
(con bool True)
(con bool False)
```

Boolean values are essential for conditional logic, particularly with the `ifThenElse` built-in function.

### Integer

Integers in UPLC are arbitrary-precision signed numbers. There's no overflow or underflow—numbers can grow as large as memory allows.

```
(con integer 42)
(con integer -1000000000000)
(con integer 0)
```

This arbitrary precision is crucial for financial calculations where rounding errors or overflow could have serious consequences.

### Bytestring

Bytestrings represent sequences of bytes, typically used for cryptographic operations, hashes, and binary data. In the textual representation, they're written as hexadecimal with a `#` prefix:

```
(con bytestring #48656c6c6f)     -- "Hello" in ASCII
(con bytestring #)               -- Empty bytestring
(con bytestring #deadbeef)       -- Arbitrary hex data
```

Each pair of hexadecimal digits represents one byte. Bytestrings are the primary type for cryptographic operations like hashing and signature verification.

### String

Strings are UTF-8 encoded text, distinct from bytestrings:

```
(con string "Hello, World!")
(con string "")                  -- Empty string
(con string "Unicode: 🎉")       -- Full UTF-8 support
```

While strings are more convenient for human-readable data, they're less efficient than bytestrings for most on-chain operations. Convert between strings and bytestrings using the `encodeUtf8` and `decodeUtf8` built-ins when needed.

### Pair

Pairs combine exactly two values of potentially different types. They're the building block for more complex data structures:

```
(con pair <integer, bool> (42, True))
(con pair <string, bytestring> ("key", #616263))
(con pair <pair<integer, integer>, string> ((1, 2), "label"))
```

The type annotation `<type1, type2>` is required in the textual representation to maintain parsing unambiguity. Access pair elements using the `fstPair` and `sndPair` built-in functions.

### List

Lists are homogeneous sequences where all elements share the same type:

```
(con list <integer> [1, 2, 3, 4, 5])
(con list <string> ["apple", "banana", "cherry"])
(con list <bool> [])              -- Empty list
(con list <pair<integer, string>> [(1, "one"), (2, "two")])
```

Lists support recursive operations through built-ins like `headList`, `tailList`, and `nullList`. They're the primary collection type for processing multiple values.

---

## The Data Type

Beyond the seven primitive types, UPLC includes a special `Data` type that serves as a universal container. Data can encode any UPLC value into a standard format used for:

- Datum and redeemer values in transactions
- Script context information
- Serialization between on-chain and off-chain code

The Data type has five constructors:

```
Constr Integer [Data]    -- Constructor with tag and fields
Map [(Data, Data)]       -- Associative array
List [Data]              -- Homogeneous list
I Integer                -- Integer value
B ByteString             -- Bytestring value
```

Conversion between primitive types and Data happens through built-in functions:

- `iData` / `unIData` for integers
- `bData` / `unBData` for bytestrings
- `constrData` / `unConstrData` for constructors
- `mapData` / `unMapData` for maps
- `listData` / `unListData` for lists

---

## Type Safety in Practice

While UPLC doesn't check types at compile time, type mismatches cause runtime failures. For example:

```
[ (builtin addInteger) (con string "not a number") ]  -- Runtime error!
```

This operation fails because `addInteger` expects integer arguments. The error manifests as transaction validation failure, costing the user transaction fees despite the failure.

---

## Memory and Performance Considerations

Different types have different memory and computational costs:

**Integers**: Size grows with the number's magnitude. Small integers are cheap; massive numbers require more memory and computation.

**Bytestrings**: Cost scales linearly with length. Preferred for binary data and cryptographic operations.

**Strings**: More expensive than bytestrings due to UTF-8 encoding overhead. Use bytestrings when possible.

**Lists**: Linear traversal cost. Accessing the nth element requires traversing n-1 elements first.

**Pairs**: Constant-time access to both elements. Useful for building efficient data structures.

**Data**: Additional encoding/decoding overhead. Necessary for transaction integration but avoid unnecessary conversions.

---

## Best Practices

When working with UPLC data types, follow these guidelines for optimal performance:

1. Use bytestrings instead of strings for data that doesn't require text processing
2. Prefer pairs over lists for fixed-size collections
3. Minimize Data conversions—only convert when interfacing with transaction data
4. Keep integers reasonably sized to control memory usage
5. Structure data to minimize traversal operations

Understanding these types and their trade-offs helps you write smart contracts that execute efficiently on-chain, saving both computation costs and transaction fees.

---