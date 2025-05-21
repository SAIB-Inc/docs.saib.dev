---
sidebar_position: 1
---

# Concepts

Transaction templates provide a high-level abstraction over the low-level `TransactionBuilder`, enabling you to define parameterized, reusable patterns for common transaction workflows — such as ADA transfers, multi-asset minting, and Plutus script interactions — with minimal boilerplate. By registering parties and configuration lambdas once, you generate fully-configured, signed transactions on demand by simply invoking the template function with your parameters.

**Automatic Coin Selection & Fee Calculation**

- Templates leverage the built-in coin selection utility (largest-first) to automatically choose UTxO inputs that cover all outputs, fees, and collateral requirements.

- Fees, collateral amounts, and script cost budgets are automatically computed based on up-to-date protocol parameters fetched via the provider.

Under the hood, templates leverage the same builder methods and extension helpers you’d use manually, but orchestrated in a deterministic, ordered fashion. This lets you focus on business logic rather than plumbing details.

---

## Lazy, Functional Configuration

- **Deferred Execution:** Every call to `.AddInput(...)`, `.AddOutput(...)`, `.AddWithdrawal(...)`, etc., does **not** immediately modify a transaction. Instead, it **registers** a small configuration function (lambda) that:
  1. Receives an options object (`InputOptions<T>`, `OutputOptions<T>`, etc.)
  2. Receives your custom parameter (`T`), e.g. `ulong amount` or `UnlockParameters`
  3. Applies settings (addresses, amounts, datum, redeemer builders)
  4. Optionally assigns an `Id` for later referential use

- **Build Time Invocation:** When you call `.Build()`, the builder:
  1. **Fetches UTxOs** for each registered party from the provider (learn more about providers in the [provider](/docs/chrysalis/tx/providers) section)
  3. **Executes** each stored lambda in the order of registration, building up a low-level `TransactionBuilder` invocation sequence
  4. **Resolves** any **redeemer builders** or **datum factories** by passing in a mapping from option `Id` → actual input/output index, along with your parameter object
  5. **Constructs** and **signs** the transaction body, witnesses, and optionally auxiliary data

---

## Party Registry

Templates introduce the concept of **named parties**, letting you abstract away raw addresses:

```csharp
.AddStaticParty("alice", aliceAddress, isChange: true)
.AddStaticParty("bob",   bobAddress)
```

- **Name**: a unique string identifier
- **Address**: bech32 string or address hex
- **isChange** flag: designates which party receives any unspent change

During `.Build()`, the template:
1. Queries the provider for UTxOs at each party’s address
2. Allows your lambdas to refer to parties by name (e.g. `opts.From = "alice"`)
3. Automatically adds change outputs back to the designated change party

---

## Parameterized Lambdas & Redeemer Builders

Templates are **generic** over a type `TParam` (e.g., `ulong` or your custom `UnlockParameters`). Each configuration lambda has the signature:

```csharp
(Action<OptionsType, TParam> configure)
```

Within these lambdas you can:
- Set `opts.From`, `opts.To`, `opts.Amount`, `opts.Datum`, `opts.UtxoRef`, etc.
- Assign an `opts.Id = "someId"` to refer to this input/output later (e.g. in redeemer builders)
- Attach a **redeemer builder**:
  ```csharp
  opts.SetRedeemerBuilder((mapping, param) => {
    // mapping.GetInput("someId") → inputIndex, outputIndices
    // return a PlutusData (or CborList<Indices>) for this script.
  });
  ```

#### RedeemerDataBuilder

A **`RedeemerDataBuilder<TParam, TData>`** is a delegate:
```csharp
(mapping: IdIndexMapping, params: TParam) -> TData
```
- **IdIndexMapping**: allows you to lookup actual numeric indices for UTxOs or outputs by the `Id` you assigned
- **TData**: any type that inherits from `CborBase` in the Chrysalis.Cbor library (e.g., `PlutusData`, `CborIndefList<Indices>`), allowing you to return arbitrary CBOR-serializable structures

> **Note:** Redeemer data builders can produce any custom CBOR type so long as it inherits `CborBase` from Chrysalis.Cbor, ensuring seamless integration with the low-level builder's witness set methods.

During build, after the low-level `TransactionBuilder` has added all inputs/outputs, the template engine:
1. Computes the mapping from your `Id` strings to concrete indices
2. Executes each redeemer builder to produce script data
3. Injects the generated data into the witness set`

---

## Processing Order & Determinism

1. **Static parties** are registered and ordered — this fixes the party-to-UTxO lookup sequence.
2. **Input lambdas** run in registration order to add funding UTxOs.
3. **Reference inputs** (CIP-31) are added similarly.
4. **Output lambdas** run in registration order; change outputs may be auto-appended.
5. **Withdrawal lambdas** are processed.
6. **Redeemer builders** are invoked last, once all indices are known.

This deterministic ordering ensures that:
- Your scripts see predictable input/output indices
- Change calculation and fee estimation remain stable

---

## Integration with Low-Level Builder

Under the hood, **TransactionTemplateBuilder** leverages the low-level `TransactionBuilder`:

1. When you call `.Build()`, a fresh `TransactionBuilder` is created with the provided protocol parameters.
2. All registered party lookups, input/output/withdrawal lambdas are invoked on that builder in order.
3. Redeemer and datum factories generate script data, which the builder then integrates.
4. Final fee calculation, collateral, witnesses, and auxiliary data are applied by the builder.

This design gives you the best of both worlds: concise, reusable templates backed by the full flexibility of the low‑level API.

---


