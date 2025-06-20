---
title: Cryptographic Primitives
sidebar_position: 4
hide_title: true
---

# Cryptographic Primitives

Chrysalis provides a complete .NET implementation of Cardano's cryptographic primitives through its `Chrysalis.Cardano.Core` namespace. These primitives are the building blocks that power address generation, transaction signing, and all security-critical operations in the library.

---

## Hash Functions

Chrysalis implements all of Cardano's hash functions through the `Chrysalis.Cardano.Core.Crypto` namespace, providing type-safe wrappers around the underlying cryptographic operations.

### Blake2b-256

The `Blake2b256` class in Chrysalis provides Cardano's primary hash function, implementing the Blake2b algorithm with a 256-bit output.

```csharp
using Chrysalis.Cardano.Core.Crypto;
using Chrysalis.Cardano.Core.Types;

// Hash arbitrary data using Chrysalis
byte[] data = Encoding.UTF8.GetBytes("Hello Cardano");
var hash = Blake2b256.ComputeHash(data);
Console.WriteLine($"Hash: {hash.ToHex()}");

// Chrysalis provides strongly-typed hashes
var transactionId = new TransactionId(Blake2b256.ComputeHash(transactionCbor));
var blockId = new BlockId(Blake2b256.ComputeHash(blockBytes));

// Hash transaction bodies for signing
var txBody = TransactionBody.Builder()
    .SetInputs(inputs)
    .SetOutputs(outputs)
    .SetFee(fee)
    .Build();

var bodyHash = txBody.GetHash(); // Uses Blake2b256 internally
```

### Blake2b-224

Chrysalis uses `Blake2b224` specifically for generating credential hashes used in addresses.

```csharp
// PublicKey class automatically uses Blake2b-224 for key hashing
var publicKey = PrivateKey.Generate().GetPublicKey();
var keyHash = publicKey.Hash(); // Returns Ed25519KeyHash

// Address creation in Chrysalis automatically handles key hashing
var baseAddress = Address.BaseAddress(
    NetworkId.Mainnet,
    PaymentCredential.KeyCredential(publicKey.Hash()),
    StakeCredential.KeyCredential(stakeKeyHash)
);

// Script hash generation for Plutus scripts
var plutusScript = PlutusV2Script.FromCbor(scriptCbor);
var scriptHash = plutusScript.Hash(); // Returns ScriptHash using Blake2b-224
```

### SHA-256 and SHA-3

Chrysalis includes SHA implementations for specific Cardano protocol requirements.

```csharp
// Script reference hashing (used in reference script validation)
var scriptRefHash = Sha256.ComputeHash(scriptBytes);

// Native script hashing follows Cardano's specification
var nativeScript = NativeScript.RequireSignature(keyHash);
var nativeScriptHash = nativeScript.Hash(); // Uses appropriate hash for script type

// Chrysalis handles protocol-specific hashing automatically
var auxiliaryData = new AuxiliaryData(metadata);
var auxDataHash = auxiliaryData.Hash(); // Protocol-compliant hashing
```

### Chrysalis Hash Types

Chrysalis provides strongly-typed hash classes that prevent mixing different hash types:

```csharp
// Type-safe hash handling prevents errors
Ed25519KeyHash keyHash = publicKey.Hash();
ScriptHash scriptHash = plutusScript.Hash();
TransactionId txId = transaction.GetId();

// Compile-time safety - this won't compile:
// PaymentCredential.KeyCredential(scriptHash); // Error!

// Proper usage:
var paymentCred = PaymentCredential.KeyCredential(keyHash);
var scriptCred = PaymentCredential.ScriptCredential(scriptHash);
```

---

## Digital Signatures

Chrysalis implements Ed25519 digital signatures through the `PrivateKey` and `PublicKey` classes in `Chrysalis.Cardano.Core.Crypto`, providing seamless integration with Cardano's signature scheme.

### Ed25519 Implementation

Chrysalis provides a complete Ed25519 implementation that handles all signature operations for Cardano transactions.

```csharp
using Chrysalis.Cardano.Core.Crypto;
using Chrysalis.Cardano.Core.Types;

// Generate cryptographically secure key pairs
var privateKey = PrivateKey.Generate();
var publicKey = privateKey.GetPublicKey();

// Keys provide easy hex/bech32 serialization
Console.WriteLine($"Private key: {privateKey.ToHex()}");
Console.WriteLine($"Public key: {publicKey.ToBech32()}");

// Sign arbitrary data
byte[] message = Encoding.UTF8.GetBytes("Transfer 100 ADA to Alice");
var signature = privateKey.Sign(message);

// Verify signatures with built-in validation
bool isValid = publicKey.Verify(message, signature);
Console.WriteLine($"Signature valid: {isValid}");
```

### Transaction Signing in Chrysalis

Chrysalis automates the complex process of transaction signing with its transaction builder.

```csharp
// Build a transaction using Chrysalis
var txBuilder = Transaction.Builder()
    .AddInput(utxo, witness: null) // Witness added during signing
    .AddOutput(recipientAddress, Value.Lovelace(5_000_000))
    .SetFee(Value.Lovelace(200_000))
    .SetTtl(currentSlot + 7200);

// Sign the transaction - Chrysalis handles hash generation
var unsignedTx = txBuilder.Build();
var signature = privateKey.Sign(unsignedTx.GetBodyHash());

// Create witness set with proper key witness
var witnessSet = TransactionWitnessSet.Builder()
    .AddVkeyWitness(new VkeyWitness(publicKey, signature))
    .Build();

var signedTx = new Transaction(unsignedTx.Body, witnessSet, unsignedTx.AuxiliaryData);
```

### HD Wallet Support

Chrysalis provides full support for BIP32 hierarchical deterministic wallets through the `ExtendedPrivateKey` class.

```csharp
using Chrysalis.Cardano.Core.Crypto.Bip32;

// Create master key from mnemonic in Chrysalis
var mnemonic = new Mnemonic("abandon abandon abandon abandon abandon abandon " +
                          "abandon abandon abandon abandon abandon abandon " +
                          "abandon abandon abandon abandon abandon abandon " +
                          "abandon abandon abandon abandon abandon art");

var rootKey = mnemonic.GetRootKey();

// Chrysalis follows CIP-1852 derivation paths
var accountKey = rootKey
    .Derive(Purpose.CIP1852)      // 1852' - Cardano improvement proposal
    .Derive(CoinType.Ada)         // 1815' - Ada coin type
    .Derive(AccountIndex.Zero);   // 0' - First account

// Generate payment and stake keys
var paymentKey = accountKey.DerivePaymentKey(0);  // External chain, index 0
var stakeKey = accountKey.DeriveStakeKey();       // Stake key (always index 0)

// Create addresses from derived keys
var baseAddress = Address.BaseAddress(
    NetworkId.Mainnet,
    PaymentCredential.KeyCredential(paymentKey.GetPublicKey().Hash()),
    StakeCredential.KeyCredential(stakeKey.GetPublicKey().Hash())
);
```

### Multi-Signature Support

Chrysalis supports native scripts for multi-signature scenarios.

```csharp
// Create multi-sig native script
var signers = new[]
{
    alice.GetPublicKey().Hash(),
    bob.GetPublicKey().Hash(),
    charlie.GetPublicKey().Hash()
};

var multiSigScript = NativeScript.RequireKOf(2, // Require 2 of 3 signatures
    signers.Select(NativeScript.RequireSignature).ToArray()
);

// Create address controlled by multi-sig script
var multiSigAddress = Address.EnterpriseAddress(
    NetworkId.Mainnet,
    PaymentCredential.ScriptCredential(multiSigScript.Hash())
);

// Build transaction requiring multiple signatures
var txBuilder = Transaction.Builder()
    .AddInput(multiSigUtxo, witness: null)
    .AddOutput(recipientAddress, amount)
    .SetFee(fee);

var unsignedTx = txBuilder.Build();
var bodyHash = unsignedTx.GetBodyHash();

// Each signer provides their signature
var aliceSignature = alicePrivateKey.Sign(bodyHash);
var bobSignature = bobPrivateKey.Sign(bodyHash);

// Build witness set with required signatures and script
var witnessSet = TransactionWitnessSet.Builder()
    .AddVkeyWitness(new VkeyWitness(alice.GetPublicKey(), aliceSignature))
    .AddVkeyWitness(new VkeyWitness(bob.GetPublicKey(), bobSignature))
    .AddNativeScript(multiSigScript)
    .Build();
```

---

## Key Derivation

Chrysalis implements Cardano-compliant key derivation through its `Chrysalis.Cardano.Core.Crypto.Bip32` namespace, following SLIP-0010 for Ed25519 curve operations.

### CIP-1852 Wallet Derivation

Chrysalis provides a complete implementation of CIP-1852, Cardano's hierarchical deterministic wallet standard.

```csharp
using Chrysalis.Cardano.Core.Crypto.Bip32;
using Chrysalis.Cardano.Core.Types;

// Chrysalis provides type-safe derivation constants
public class CardanoWallet
{
    private readonly ExtendedPrivateKey accountKey;
    
    public CardanoWallet(Mnemonic mnemonic, uint accountIndex = 0)
    {
        var rootKey = mnemonic.GetRootKey();
        
        // Chrysalis handles CIP-1852 derivation automatically
        accountKey = rootKey
            .Derive(Purpose.CIP1852)          // 1852' hardened
            .Derive(CoinType.Ada)             // 1815' hardened  
            .Derive(new AccountIndex(accountIndex)); // account' hardened
    }
    
    // Generate receiving addresses (external chain)
    public Address GetReceivingAddress(uint index)
    {
        var paymentKey = accountKey.DerivePaymentKey(index);
        var stakeKey = accountKey.DeriveStakeKey();
        
        return Address.BaseAddress(
            NetworkId.Mainnet,
            PaymentCredential.KeyCredential(paymentKey.GetPublicKey().Hash()),
            StakeCredential.KeyCredential(stakeKey.GetPublicKey().Hash())
        );
    }
    
    // Generate change addresses (internal chain) 
    public Address GetChangeAddress(uint index)
    {
        var changeKey = accountKey.DeriveChangeKey(index);
        var stakeKey = accountKey.DeriveStakeKey();
        
        return Address.BaseAddress(
            NetworkId.Mainnet,
            PaymentCredential.KeyCredential(changeKey.GetPublicKey().Hash()),
            StakeCredential.KeyCredential(stakeKey.GetPublicKey().Hash())
        );
    }
    
    // Get the reward address for this wallet
    public Address GetRewardAddress()
    {
        var stakeKey = accountKey.DeriveStakeKey();
        return Address.RewardAddress(
            NetworkId.Mainnet,
            StakeCredential.KeyCredential(stakeKey.GetPublicKey().Hash())
        );
    }
}
```

### Mnemonic Management

Chrysalis provides comprehensive BIP39 mnemonic support with built-in validation and entropy management.

```csharp
using Chrysalis.Cardano.Core.Crypto;

// Generate cryptographically secure mnemonics
var mnemonic12 = Mnemonic.Generate(MnemonicLength.Words12);
var mnemonic24 = Mnemonic.Generate(MnemonicLength.Words24);

Console.WriteLine($"12-word mnemonic: {mnemonic12.GetPhrase()}");
Console.WriteLine($"24-word mnemonic: {mnemonic24.GetPhrase()}");

// Restore wallet from existing mnemonic with validation
public static bool TryRestoreWallet(string mnemonicPhrase, out CardanoWallet wallet)
{
    wallet = null;
    
    if (!Mnemonic.IsValid(mnemonicPhrase))
    {
        return false;
    }
    
    try
    {
        var mnemonic = new Mnemonic(mnemonicPhrase);
        wallet = new CardanoWallet(mnemonic);
        return true;
    }
    catch
    {
        return false;
    }
}

// Support for passphrase-protected mnemonics
var mnemonic = new Mnemonic(mnemonicPhrase);
var rootKeyWithPassphrase = mnemonic.GetRootKey("user-defined-passphrase");

// Access entropy for advanced use cases
var entropy = mnemonic.GetEntropy();
Console.WriteLine($"Entropy: {Convert.ToHexString(entropy)}");
```

### Extended Public Keys

Chrysalis supports extended public keys for watch-only wallets and key sharing scenarios.

```csharp
// Export extended public key for watch-only wallet
var accountXPub = accountKey.GetExtendedPublicKey();
var xpubString = accountXPub.ToBase58(); // Standard Base58 encoding

// Create watch-only wallet from extended public key
public class WatchOnlyWallet
{
    private readonly ExtendedPublicKey accountXPub;
    
    public WatchOnlyWallet(string xpubBase58)
    {
        accountXPub = ExtendedPublicKey.FromBase58(xpubBase58);
    }
    
    // Generate addresses without private keys
    public Address GetAddress(bool isChange, uint index)
    {
        var publicKey = isChange 
            ? accountXPub.DeriveChangeKey(index)
            : accountXPub.DerivePaymentKey(index);
            
        var stakePublicKey = accountXPub.DeriveStakeKey();
        
        return Address.BaseAddress(
            NetworkId.Mainnet,
            PaymentCredential.KeyCredential(publicKey.Hash()),
            StakeCredential.KeyCredential(stakePublicKey.Hash())
        );
    }
    
    // Cannot sign transactions - only generate addresses and verify signatures
    public bool VerifySignature(byte[] message, Signature signature, uint keyIndex)
    {
        var publicKey = accountXPub.DerivePaymentKey(keyIndex);
        return publicKey.Verify(message, signature);
    }
}
```


---

## Next Steps

- [Cardano Addresses](./cardano-addresses) - See how cryptographic primitives are used in address generation
- [Transaction Model](./transaction-model) - Learn how signatures secure transactions
- [CBOR Fundamentals](./cbor-fundamentals) - Understand how cryptographic data is encoded
- [Quick Start Guide](../getting-started/quick-start) - Start using cryptographic operations in your applications