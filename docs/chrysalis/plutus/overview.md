---
title: Overview
sidebar_position: 1
---

# Plutus VM

Chrysalis.Plutus is a pure managed C# implementation of the Plutus UPLC (Untyped Plutus Lambda Calculus) interpreter. No Haskell FFI, no Rust FFI, no native dependencies — just C# running on .NET.

## Conformance

**999/999 UPLC conformance tests** covering:
- Plutus V1, V2, and V3
- All 94 built-in functions
- BLS12-381 cryptographic primitives (pairing, G1/G2 operations, hash-to-curve)
- Integer, bytestring, string, list, pair, and data operations
- Cryptographic builtins: Ed25519, SHA-256, SHA3-256, Blake2b, Keccak-256, RIPEMD-160

## Usage

Evaluate all scripts in a transaction:

```csharp
using Chrysalis.Tx.Extensions;

IReadOnlyList<EvaluationResult> results = ScriptContextBuilder.EvaluateTx(
    body, witnessSet, utxos, SlotNetworkConfig.Preview);

foreach (var r in results)
    Console.WriteLine($"[{r.RedeemerTag}:{r.Index}] mem={r.ExUnits.Mem} steps={r.ExUnits.Steps}");
```

## TransactionBuilder Integration

The Plutus VM integrates automatically with `TransactionBuilder`. When you build a transaction that includes scripts, the builder evaluates them and sets the execution units — no external evaluator needed.

## Architecture

The VM implements a CEK (Control, Environment, Kontinuation) machine:

- **Control** — the current term being evaluated
- **Environment** — variable bindings (de Bruijn indexed)
- **Kontinuation** — the evaluation stack (what to do next)

### Built-in Functions

All 94 Plutus built-in functions are implemented as native C# methods. They cover:
- **Arithmetic**: `addInteger`, `multiplyInteger`, `divideInteger`, `modInteger`, etc.
- **Bytestring**: `appendByteString`, `sliceByteString`, `indexByteString`, `consByteString`
- **Cryptography**: `verifyEd25519Signature`, `verifyEcdsaSecp256k1Signature`, `verifySchnorrSecp256k1Signature`
- **Hashing**: `sha2_256`, `sha3_256`, `blake2b_224`, `blake2b_256`, `keccak_256`, `ripemd_160`
- **BLS12-381**: `bls12_381_G1_add`, `bls12_381_G2_add`, `bls12_381_millerLoop`, `bls12_381_finalVerify`, `bls12_381_G1_hashToGroup`, `bls12_381_G2_hashToGroup`
- **Data**: `constrData`, `mapData`, `listData`, `iData`, `bData`, `unConstrData`, etc.
- **Lists/Pairs**: `mkCons`, `headList`, `tailList`, `mkPairData`, `fstPair`, `sndPair`

### BLS12-381

The BLS12-381 implementation is a pure C# port of [noble-curves](https://github.com/paulmillr/noble-curves) — no native bindings. It supports all BLS operations required by Plutus V3 including pairing checks, group operations, and hash-to-curve.
