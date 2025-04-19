---
sidebar_position: 2
---

# Creating Templates

This guide shows how to define, build, and execute a transaction template for complex workflows—such as unlocking a Plutus script—using the high-level `TransactionTemplateBuilder`.

---

## 1. Instantiate Template Builder

Choose a parameter type `TParam` (e.g., `UnlockParameters`) and create the builder:

```csharp
var unlockTemplate = TransactionTemplateBuilder<UnlockParameters>
    .Create(provider);
```

- `provider` implements `ITransactionProvider` (e.g., Blockfrost).

---

## 2. Register Parties

Assign names to addresses and designate the change address:

```csharp
unlockTemplate
    .AddStaticParty("rico",      ricoAddress,     isChange: true)
    .AddStaticParty("validator", validatorAddress);
```

- **Name**: unique identifier for UTxO lookups.
- **isChange**: route any leftover funds back to this party.

---

## 3. Add Inputs

Use `.AddInput(...)` to add funding UTxOs to your template. You can configure basic inputs or advanced inputs with identifiers and redeemer builders:

```csharp
// Basic input from a named party
unlockTemplate.AddInput((opts, p) => {
    opts.From    = "validator";
});
```

- **opts.From**: refers to a party registered via `.AddStaticParty(...)`.

**Optional features:**

- **Assign an Id**: to reference this input in redeemer builders or outputs:
  ```csharp
  unlockTemplate.AddInput((opts, p) => {
      opts.From = "validator";
      opts.Id   = "lock";
  });
  ```

- **Redeemer Builder**: provide a function that generates CBOR data (any type inheriting from `CborBase`):
  ```csharp
  unlockTemplate.AddInput((opts, p) => {
      opts.From = "validator";
      opts.Id   = "lock";
      opts.SetRedeemerBuilder((mapping, parameters) =>
          // return custom CborBase (e.g., PlutusData)
          spendRedeemerBuilder(mapping, parameters)
      );
  });
  ```

---

## 4. Add Outputs

Use `.AddOutput(...)` to specify where funds or tokens should go. Configure basic outputs or link them to inputs via identifiers:

```csharp
// Basic output to a named party
unlockTemplate.AddOutput((opts, p) => {
    opts.To     = "rico";
    opts.Amount = p.MainAmount;
});
```

- **opts.To**: refers to a party registered via `.AddStaticParty(...)`.
- **opts.Amount**: a `Value` such as `Lovelace` or `MultiAsset`.

**Optional features:**

- **Associate with Input Id**: ensures input/output indices align for custom redeemer logic:
  ```csharp
  unlockTemplate.AddOutput((opts, p) => {
      opts.To                = "alice";
      opts.Amount            = p.MainAmount;
      opts.AssociatedInputId = "lock";
  });
  ```
  Useful when your validator logic inspects specific input or output positions.

---

## 5. Build the Template Function

Generate a reusable delegate that constructs an unsigned `Transaction`:

```csharp
Func<UnlockParameters, Task<PostMaryTransaction>> buildUnlock = unlockTemplate.Build();
```

---

## 6. Execute & Sign

Invoke the template delegate with your parameters to build an unsigned transaction, then sign and submit:

**Parameters Preparation**: Construct your `UnlockParameters` instance containing all necessary fields (UTxO outrefs, datums, amounts).

**Building the Transaction**: Call the built template function (e.g., `buildUnlock(unlockParams)`) to obtain a `PostMaryTransaction`.

**Signing**: Use your `privateKey` to sign the transaction, producing a ready-to-submit `Transaction`.

---

## 6. Examples

### 6.1 Simple ADA Transfer

Configure and build a basic transfer template:

```csharp
// Initialize template builder
var transferTemplate = TransactionTemplateBuilder<ulong>
    .Create(provider)
    .AddStaticParty("alice", ricoAddress, isChange: true)

    // Input from rico
    .AddInput((opts, amount) => {
        opts.From   = "alice";
    })

    // Output back to rico
    .AddOutput((opts, amount) => {
        opts.To     = "alice";
        opts.Amount = new Lovelace(amount);
    })

    // Build the delegate
    .Build();

// Execute: send 10 ADA
var unsignedTransfer = await transferTemplate(10_000_000UL);
var signedTransfer   = unsignedTransfer.Sign(privateKey);
await provider.SubmitTransactionAsync(signedTransfer.ToCbor());
```

### 6.2 Unlock Smart Contract Utxo

Configure and build the unlock template:

```csharp
// Initialize template builder
var unlockTemplate = TransactionTemplateBuilder<UnlockParameters>
    .Create(provider)
    .AddStaticParty("alice",      aliceAddress,     isChange: true)
    .AddStaticParty("validator", validatorAddress)

    // Reference input for script
    .AddReferenceInput((opts, p) => {
        opts.From    = "validator";
        opts.UtxoRef = p.ScriptRefUtxoOutref;
    })

    // Locked UTxO with redeemer
    .AddInput((opts, p) => {
        opts.From    = "validator";
        opts.UtxoRef = p.LockedUtxoOutRef;
        opts.Id      = "lock";
        opts.SetRedeemerBuilder((mapping, parameters) =>
            parameters.Redeemer  // directly use RedeemerMap from params
        );
    })

    // Output after unlock
    .AddOutput((opts, p) => {
        opts.To     = "alice";
        opts.Amount = p.Amount;
    })

    // Build the delegate
    .Build();

// Prepare unlock parameters
var unlockParams = new UnlockParameters(
    new TransactionInput(Convert.FromHexString(lockUtxoTxHash), 0),
    new TransactionInput(Convert.FromHexString(scriptRefTxHash), 0),
    new Lovelace(20_000_000),
);

// Execute unlock
var unsignedUnlock = await unlockTemplate(unlockParams);
var signedUnlock   = unsignedUnlock.Sign(privateKey);
Console.WriteLine(Convert.ToHexString(CborSerializer.Serialize(signedUnlock)));
```

These examples illustrate how to configure, build, and execute both a simple ADA transfer and a Plutus unlock using transaction templates.

