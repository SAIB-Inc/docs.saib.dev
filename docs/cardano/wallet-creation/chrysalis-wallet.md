---
title: Chrysalis.Wallet
sidebar_position: 3
---

# Using Chrysalis.Wallet

Chrysalis.Wallet is a powerful .NET library that simplifies Cardano wallet operations. This guide shows you how to create wallets, manage keys, and build transactions using C# and the Chrysalis framework.

---

## Prerequisites

- .NET 6.0 or later
- Visual Studio 2022 or VS Code
- NuGet package manager
- Chrysalis.Wallet package installed in your project

---

## Creating a Wallet

### Basic Wallet Generation

Follow these steps to create a new Cardano wallet using Chrysalis:

#### Step 1: Import Required Namespaces

First, include the necessary Chrysalis namespaces in your C# file:

```csharp
using Chrysalis.Wallet;
using Chrysalis.Wallet.Types;
```

#### Step 2: Generate Recovery Phrase

Create a new 24-word mnemonic phrase that will serve as your wallet's master seed. This phrase can regenerate all your wallet's keys and addresses:

```csharp
// Generate a new wallet with 24-word mnemonic
var mnemonic = MnemonicService.Generate(24);
Console.WriteLine($"Recovery Phrase: {mnemonic}");

// IMPORTANT: Store this phrase securely - it's the only way to recover your wallet!
```

#### Step 3: Create Wallet Instance

Initialize a new wallet using the generated mnemonic. The wallet object manages all cryptographic operations and key derivations:

```csharp
// Create wallet from mnemonic
var wallet = new CardanoWallet(mnemonic, NetworkType.Mainnet);

// For testnet, use: NetworkType.Testnet
```

#### Step 4: Derive Account and Address

Access the first account (index 0) and generate your first receiving address. Cardano uses HD wallet standards where accounts contain multiple addresses:

```csharp
// Get the first account (account index 0)
var account = wallet.GetAccount(0);

// Generate the first external (receiving) address
var address = account.GetAddress(0, false); // false = external, true = internal (change)
Console.WriteLine($"Your first address: {address}");
```

### Import Existing Wallet

Follow these steps to restore an existing wallet from a recovery phrase:

#### Step 1: Prepare Your Recovery Phrase

Ensure you have your 24-word recovery phrase ready. This should be the exact phrase you saved when creating your wallet:

```csharp
// Your existing 24-word recovery phrase
string existingMnemonic = "word1 word2 word3 ... word24";

// Ensure the phrase is properly formatted (single spaces between words)
existingMnemonic = existingMnemonic.Trim();
```

#### Step 2: Create Wallet from Recovery Phrase

Initialize a wallet instance using your existing mnemonic. This will restore access to all your addresses and funds:

```csharp
// Import wallet from existing mnemonic
var wallet = new CardanoWallet(existingMnemonic, NetworkType.Mainnet);

// Make sure to use the same network type as your original wallet
```

#### Step 3: Verify Wallet Recovery

Confirm the wallet was restored correctly by checking a known address. This ensures you've entered the correct recovery phrase:

```csharp
// Access the first account
var account = wallet.GetAccount(0);

// Get the first address (should match your original wallet's first address)
var firstAddress = account.GetAddress(0, false);
Console.WriteLine($"Recovered address: {firstAddress}");

// You can compare this with your known address to verify successful recovery
```

#### Step 4: Access Your Funds

Once verified, you can access all your addresses and check balances:

```csharp
// Generate multiple addresses if needed
for (int i = 0; i < 5; i++)
{
    var address = account.GetAddress(i, false);
    Console.WriteLine($"Address {i}: {address}");
}
```

---

## Key Management

Chrysalis.Wallet follows HD (Hierarchical Deterministic) wallet standards, allowing you to generate unlimited addresses from a single master seed. This section covers how to derive multiple addresses and export keys for compatibility with other tools.

### Derive Addresses

HD wallets can generate millions of unique addresses from a single seed, organized into accounts and address chains. Each account can have external addresses (for receiving funds) and internal addresses (for change). This hierarchical structure helps you organize funds and maintain privacy by using different addresses for different purposes.

```csharp
var wallet = new CardanoWallet(mnemonic, NetworkType.Mainnet);
var account = wallet.GetAccount(0);

// Generate 10 receiving addresses
for (int i = 0; i < 10; i++)
{
    var address = account.GetAddress(i, false);
    Console.WriteLine($"Address {i}: {address}");
}

// Generate change addresses
var changeAddress = account.GetAddress(0, true);
Console.WriteLine($"Change address: {changeAddress}");
```

### Export Keys

Sometimes you need to export individual keys for specific operations like multi-signature setups, hardware wallet integration, or compatibility with other tools like cardano-cli. Chrysalis.Wallet provides methods to safely extract both payment and stake keys in various formats. Remember that exported private keys should be handled with extreme care as they provide direct access to your funds.

```csharp
// Get payment keys
var paymentKey = account.GetPaymentKey(0, false);
var paymentPubKey = paymentKey.PublicKey;
var paymentPrivKey = paymentKey.PrivateKey;

// Get stake keys
var stakeKey = account.GetStakeKey();
var stakePubKey = stakeKey.PublicKey;
var stakePrivKey = stakeKey.PrivateKey;

// Export for cardano-cli compatibility
var cliFormat = paymentKey.ToCborHex();
```

---

## Balance and UTxOs

Cardano uses the UTxO (Unspent Transaction Output) model where your balance is the sum of all unspent outputs. Chrysalis provides integrated services to query balances and retrieve detailed UTxO information needed for transaction building.

### Query Wallet Balance

Check wallet balance using Chrysalis indexer integration:

```csharp
using Chrysalis.Wallet.Services;

// Initialize wallet service
var walletService = new WalletService(networkType: NetworkType.Mainnet);

// Get wallet balance
var address = account.GetAddress(0, false);
var balance = await walletService.GetBalance(address);

Console.WriteLine($"Total ADA: {balance.Lovelace / 1_000_000m}");

// Get detailed UTxOs
var utxos = await walletService.GetUtxos(address);
foreach (var utxo in utxos)
{
    Console.WriteLine($"UTxO: {utxo.TxHash}#{utxo.OutputIndex} = {utxo.Value.Lovelace} lovelace");
}
```

---

## Transaction Building

Transaction building is the core of blockchain interaction, allowing you to send ADA and interact with smart contracts. Chrysalis provides a fluent builder pattern that simplifies creating, signing, and submitting transactions while handling complex details like fee calculation and change outputs.

### Simple ADA Transfer

Build and sign a transaction:

```csharp
using Chrysalis.Wallet.TransactionBuilding;

// Initialize transaction builder
var txBuilder = new TransactionBuilder(NetworkType.Mainnet);

// Build transaction
var tx = txBuilder
    .AddInput(utxo)
    .AddOutput(recipientAddress, 10_000_000) // 10 ADA
    .AddChangeOutput(changeAddress)
    .SetFee(200_000) // 0.2 ADA
    .Build();

// Sign transaction
var signedTx = wallet.SignTransaction(tx, account);

// Submit transaction
var txHash = await walletService.SubmitTransaction(signedTx);
Console.WriteLine($"Transaction submitted: {txHash}");
```

### Advanced Transaction Features

Build complex transactions with metadata:

```csharp
// Transaction with metadata
var metadata = new TransactionMetadata();
metadata.Add(674, new { msg = "Hello Cardano!" });

var tx = txBuilder
    .AddInput(utxo)
    .AddOutput(recipientAddress, 5_000_000)
    .AddMetadata(metadata)
    .AddChangeOutput(changeAddress)
    .CalculateFee() // Auto-calculate minimum fee
    .Build();

// Multi-signature transaction
var multiSigTx = txBuilder
    .AddInput(utxo)
    .AddOutput(recipientAddress, 20_000_000)
    .RequireSignature(additionalPubKeyHash)
    .SetValidityInterval(slot + 1000) // Valid for 1000 slots
    .Build();
```

---

## Next Steps

- Explore [Chrysalis documentation](https://github.com/Saib-Inc/Chrysalis) for advanced features
- Learn about [smart contract integration](/docs/chrysalis/smart-contracts)
- Build DeFi applications with Chrysalis
- Join the SAIB developer community for support