---
title: Mnemonic
sidebar_position: 2
---

# Mnemonic Generation & Restoration

Chrysalis.Wallet supports BIP‑39 and Cardano’s CIP‑3 for mnemonic seed phrases.  

## Generate a New Mnemonic

```csharp
// Create a fresh 24‑word English seed phrase
Mnemonic newMnemonic = Mnemonic.Generate(24, English.Words);
Console.WriteLine(string.Join(' ', newMnemonic.Words));
```

## Restore from Existing Phrase

```csharp
string words = "mosquito caught anger aware legal project ...";
Mnemonic restored = Mnemonic.Restore(words, English.Words);
// Derive the root key for further HD paths
var rootKey = restored.GetRootKey();
```

Mnemonic operations leverage PBKDF2 and the selected wordlist under the hood, ensuring compatibility with other Cardano tools.