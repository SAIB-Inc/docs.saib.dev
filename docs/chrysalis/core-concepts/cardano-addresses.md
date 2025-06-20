---
title: Cardano Addresses
sidebar_position: 3
hide_title: true
---

# Cardano Addresses

Cardano addresses are cryptographic identifiers used to send and receive ADA and other tokens on the Cardano blockchain. Chrysalis provides comprehensive support for working with all types of Cardano addresses through a type-safe, .NET-friendly API.

---

## Address Types

Cardano supports several address types, each serving different purposes. Understanding when and how to use each type is crucial for building robust Cardano applications.

### Base Addresses

Base addresses are the most versatile and commonly used address type in Cardano. They contain both payment and staking credentials, allowing the holder to both receive/send funds and participate in staking.

**Key Characteristics:**
- Contains both payment and staking credentials
- Can receive UTxOs and earn staking rewards
- Most efficient for regular users who want to stake their ADA

**Usage Examples:**

Creating from existing credentials:
```csharp
// Create a base address from payment and staking credentials
var paymentCredential = new PaymentCredential(paymentKeyHash);
var stakingCredential = new StakingCredential(stakingKeyHash);
var baseAddress = Address.CreateBase(
    NetworkId.Mainnet,
    paymentCredential,
    stakingCredential
);
```

Creating from key pairs:
```csharp
// Create from key pair
var paymentKey = PrivateKey.Generate();
var stakingKey = PrivateKey.Generate();
var baseAddressFromKeys = Address.CreateBase(
    NetworkId.Mainnet,
    new PaymentCredential(paymentKey.PublicKey.Hash()),
    new StakingCredential(stakingKey.PublicKey.Hash())
);
```

Creating with script-based payment:
```csharp
// Create with script hash for payment
var scriptHash = PlutusScript.FromCbor(scriptBytes).Hash();
var scriptBaseAddress = Address.CreateBase(
    NetworkId.Mainnet,
    new PaymentCredential(scriptHash),
    new StakingCredential(stakingKeyHash)
);
```

**When to Use:**
- **Regular user wallets**: The standard choice for personal wallets where users want to both hold funds and earn staking rewards
- **DApp user addresses**: Ideal for decentralized applications where users interact with smart contracts while maintaining staking capabilities
- **Exchange personal wallets**: When exchanges offer staking services to their users, base addresses allow customers to earn rewards on their holdings
- **Long-term holdings**: Perfect for HODLers who want to maximize returns through staking while maintaining full control of their funds
- **Multi-signature wallets**: When implementing shared custody solutions that also need staking functionality
- **Default choice for most applications**: Unless you have a specific reason to use another address type, base addresses provide the most flexibility
- **Smart contract interactions**: When users need to interact with DeFi protocols, NFT marketplaces, or other smart contracts while keeping their staking active
- **Hardware wallet addresses**: Most hardware wallets generate base addresses to give users the full Cardano experience

### Enterprise Addresses

Enterprise addresses contain only payment credentials without any staking component. They are designed for exchanges, businesses, and scenarios where staking management is handled separately or not needed.

**Key Characteristics:**
- Contains only payment credential (no staking)
- Cannot directly earn staking rewards
- Slightly smaller transaction size (no staking credential)
- Useful for high-volume transaction processing
- Bech32 prefix: `addr1` (mainnet) or `addr_test1` (testnet)

**Usage Examples:**

```csharp
// Create an enterprise address (no staking)
var paymentCredential = new PaymentCredential(paymentKeyHash);
var enterpriseAddress = Address.CreateEnterprise(
    NetworkId.Mainnet,
    paymentCredential
);

// Create from private key
var privateKey = PrivateKey.Generate();
var enterpriseFromKey = Address.CreateEnterprise(
    NetworkId.Mainnet,
    new PaymentCredential(privateKey.PublicKey.Hash())
);

// Create script-controlled enterprise address
var scriptHash = PlutusScript.FromCbor(scriptBytes).Hash();
var scriptEnterprise = Address.CreateEnterprise(
    NetworkId.Mainnet,
    new PaymentCredential(scriptHash)
);

// Convert base address to enterprise (remove staking)
var baseAddr = Address.FromBech32("addr1...");
var enterpriseOnly = Address.CreateEnterprise(
    baseAddr.NetworkId,
    baseAddr.PaymentCredential
);
```

**When to Use:**
- **Exchange hot wallets**: Ideal for high-volume exchange operations where staking would complicate fund management and regulatory compliance
- **High-frequency trading systems**: When transaction throughput is critical and staking rewards are managed separately through dedicated pools
- **Temporary addresses for specific operations**: Perfect for one-time use addresses, payment channels, or time-limited escrow services
- **Smart contract addresses that don't need staking**: Treasury contracts, liquidity pools, or automated market makers where staking would interfere with the protocol logic
- **Simplified custody solutions**: When building custody services that need clean separation between fund management and staking operations
- **Merchant payment processing**: For businesses accepting Cardano payments where accounting simplicity is more important than staking rewards
- **Batched transaction systems**: When processing multiple transactions in batches and staking would add unnecessary complexity
- **Bridge contracts**: Cross-chain bridges often use enterprise addresses to simplify the bridging logic
- **Regulatory compliance**: In jurisdictions where staking might complicate tax reporting or regulatory requirements
- **Testing and development**: During development phases when you need simple addresses without staking considerations

### Reward Addresses

Reward addresses are special-purpose addresses used exclusively for receiving staking rewards. They cannot hold regular UTxOs and are automatically created when delegating stake.

**Key Characteristics:**
- Contains only staking credential
- Cannot receive regular transactions (only rewards)
- Automatically receives staking rewards
- One reward address per staking credential
- Bech32 prefix: `stake1` (mainnet) or `stake_test1` (testnet)

**Usage Examples:**

```csharp
// Create a reward address for receiving staking rewards
var stakingCredential = new StakingCredential(stakingKeyHash);
var rewardAddress = Address.CreateReward(
    NetworkId.Mainnet,
    stakingCredential
);

// Create from staking key
var stakingKey = PrivateKey.Generate();
var rewardFromKey = Address.CreateReward(
    NetworkId.Mainnet,
    new StakingCredential(stakingKey.PublicKey.Hash())
);

// Get reward address from base address
var baseAddress = Address.FromBech32("addr1...");
if (baseAddress.HasStakingCredential)
{
    var associatedReward = Address.CreateReward(
        baseAddress.NetworkId,
        baseAddress.StakingCredential
    );
}

// Check reward balance
var rewardBalance = await GetRewardBalance(rewardAddress);
Console.WriteLine($"Rewards available: {rewardBalance.Lovelace} lovelace");
```

**When to Use:**
- **Querying staking rewards**: Essential for wallet applications to display accumulated rewards to users
- **Withdrawing accumulated rewards**: Required when building reward withdrawal transactions to move rewards to spendable addresses
- **Stake pool operations**: Pool operators use reward addresses to track and distribute operator rewards
- **Delegation certificate creation**: Necessary when creating delegation certificates to specify where rewards should accumulate
- **Portfolio management tools**: Analytics platforms use reward addresses to calculate accurate staking yields and APY
- **Tax reporting applications**: For generating accurate tax reports that need to track staking income separately
- **Multi-wallet aggregation**: When building tools that aggregate rewards across multiple wallets or addresses
- **Automated reward claiming**: For services that automatically claim and reinvest staking rewards
- **Staking dashboards**: Real-time monitoring of reward accumulation across different stake pools
- **Wallet recovery processes**: Important for ensuring users can access accumulated rewards when recovering wallets

**Important Notes:**
- Rewards must be explicitly withdrawn to a regular address
- Cannot send funds directly to a reward address
- Linked to delegation status of the staking credential

### Byron Addresses

Byron addresses are legacy addresses from Cardano's first era. While still supported for backward compatibility, they should not be used for new applications.

**Key Characteristics:**
- Legacy format from pre-Shelley era
- No staking capability
- Different cryptographic structure
- Larger size than Shelley addresses
- Base58 encoding (not Bech32)
- Prefix: `Ae2`, `DdzFF`, or `Addr`

**Usage Examples:**

```csharp
// Parse a Byron address (read-only operations)
var byronAddress = Address.FromBase58("Ae2tdPwUPEZ...");

// Check if address is Byron era
if (address.Type == AddressType.Byron)
{
    Console.WriteLine("Warning: Byron address detected");
    // Handle legacy address appropriately
}

// Convert Byron to Enterprise (migration path)
var byronAddr = Address.FromBase58("DdzFF...");
var paymentKeyHash = ExtractPaymentKeyHash(byronAddr); // Custom extraction
var modernAddress = Address.CreateEnterprise(
    NetworkId.Mainnet,
    new PaymentCredential(paymentKeyHash)
);

// Validate Byron address
try 
{
    var byron = Address.FromBase58(legacyAddress);
    if (byron.NetworkId != NetworkId.Mainnet)
    {
        throw new Exception("Byron testnet addresses not supported");
    }
}
catch (InvalidAddressException)
{
    Console.WriteLine("Invalid Byron address format");
}
```

**When to Use:**
- **Supporting legacy wallets**: Only when maintaining compatibility with old wallets that haven't migrated to Shelley addresses
- **Historical transaction analysis**: When analyzing blockchain data from the Byron era (pre-July 2020)
- **Migration tools**: Building tools to help users migrate from Byron to Shelley addresses
- **Never for new development**: Byron addresses should never be generated for new applications
- **Legacy exchange integration**: Some older exchange systems might still use Byron addresses for deposits
- **Blockchain explorers**: When building explorers that need to display historical Byron-era transactions
- **Wallet recovery services**: For recovering funds from very old wallets created before the Shelley era
- **Archival purposes**: Research or archival systems studying Cardano's evolution
- **Emergency fund recovery**: As a last resort when users have funds stuck in Byron addresses
- **Compliance with old systems**: Only when absolutely required by legacy systems that cannot be updated

**Migration Considerations:**
- Byron addresses cannot stake
- Higher transaction fees due to size
- Consider providing migration paths for users
- Some wallets may still generate Byron addresses

---

## Working with Addresses

### Creating Addresses

Chrysalis provides multiple ways to create addresses, each suited for different scenarios. Understanding these methods is essential for building robust Cardano applications.

**From Public Key Hash:**

The most common method for creating user-controlled addresses. This approach is used when you have access to public keys and want to create standard wallet addresses.

```csharp
// Create address from public key hash
var publicKey = PublicKey.FromHex("581e581c01fb3595efb04cd77cf9a20a7e46888042e4be26...");
var pubKeyHash = publicKey.Hash();

// Create base address with payment and staking
var paymentCredential = new PaymentCredential(pubKeyHash);
var stakingCredential = new StakingCredential(stakeKeyHash);

var address = Address.CreateBase(
    NetworkId.Mainnet,
    paymentCredential,
    stakingCredential
);

// Alternative: Create enterprise address (no staking)
var enterpriseAddr = Address.CreateEnterprise(
    NetworkId.Mainnet,
    paymentCredential
);
```

**From Script Hash:**

Used for creating smart contract addresses where spending is controlled by validator scripts rather than signatures.

```csharp
// Load and hash a Plutus script
var scriptBytes = File.ReadAllBytes("validator.plutus");
var plutusScript = PlutusScript.FromCbor(scriptBytes);
var scriptHash = plutusScript.Hash();

// Create script-controlled address with staking
var scriptAddress = Address.CreateBase(
    NetworkId.Mainnet,
    new PaymentCredential(scriptHash),
    stakingCredential  // Can be key-based or script-based
);

// Create pure script address (no staking)
var pureScriptAddr = Address.CreateEnterprise(
    NetworkId.Mainnet,
    new PaymentCredential(scriptHash)
);

// Store script hash for transaction building
Console.WriteLine($"Script hash: {scriptHash.ToHex()}");
```

**From Bech32 String:**

Parsing existing addresses is crucial for interoperability with wallets and other tools.

```csharp
// Parse mainnet address
var addressFromBech32 = Address.FromBech32(
    "addr1qy2jt0qpqgtfqhve08772gw0p4wnv4rfz0kxwqsw0pnrnu6djtl8k0t4f9aqvmkhlg9dxzr7mz7sx3pfa9meqhtt27nqjxu2kk"
);

// Parse with validation
try
{
    var address = Address.FromBech32(userProvidedAddress);
    Console.WriteLine($"Valid {address.Type} address on {address.NetworkId}");
}
catch (InvalidAddressException ex)
{
    Console.WriteLine($"Invalid address: {ex.Message}");
}

// Parse different address types
var testnetAddr = Address.FromBech32("addr_test1...");
var stakeAddr = Address.FromBech32("stake1...");
```

**From HD Wallet Derivation:**

Hierarchical Deterministic (HD) wallet derivation follows CIP-1852 standard for Cardano.

```csharp
// Standard Cardano derivation path: m/1852'/1815'/0'/role/index
var mnemonicWords = "abandon abandon abandon ... abandon about";
var mnemonic = new Mnemonic(mnemonicWords);
var rootKey = mnemonic.GetRootKey();

// Derive account key (hardened derivation)
var accountKey = rootKey
    .Derive(1852 | 0x80000000)  // Purpose (CIP-1852)
    .Derive(1815 | 0x80000000)  // Coin type (ADA)
    .Derive(0 | 0x80000000);    // Account index

// Derive payment key (non-hardened)
var paymentKey = accountKey
    .Derive(0)  // External chain (0 = external, 1 = internal/change)
    .Derive(0); // Address index

// Derive staking key (shared across all addresses in account)
var stakingKey = accountKey
    .Derive(2)  // Staking chain
    .Derive(0); // Always 0 for staking

// Create HD wallet address
var hdAddress = Address.CreateBase(
    NetworkId.Mainnet,
    new PaymentCredential(paymentKey.PublicKey.Hash()),
    new StakingCredential(stakingKey.PublicKey.Hash())
);

// Generate multiple addresses from same account
for (int i = 0; i < 10; i++)
{
    var payKey = accountKey.Derive(0).Derive(i);
    var addr = Address.CreateBase(
        NetworkId.Mainnet,
        new PaymentCredential(payKey.PublicKey.Hash()),
        new StakingCredential(stakingKey.PublicKey.Hash())
    );
    Console.WriteLine($"Address {i}: {addr.ToBech32()}");
}
```

**From Other Sources:**

```csharp
// From hex string
var addressFromHex = Address.FromHex(
    "019493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e..."
);

// From byte array
byte[] addressBytes = GetAddressBytes();
var addressFromBytes = Address.FromBytes(addressBytes);

// From CBOR
var cborBytes = GetCborEncodedAddress();
var addressFromCbor = Address.FromCbor(cborBytes);

// Clone existing address
var originalAddress = Address.FromBech32("addr1...");
var clonedAddress = Address.CreateBase(
    originalAddress.NetworkId,
    originalAddress.PaymentCredential,
    originalAddress.StakingCredential
);
```

### Address Components

Understanding and extracting address components is crucial for transaction building, validation, and blockchain analysis. Each Cardano address encodes specific information that can be programmatically accessed.

**Getting Network ID:**

The network ID determines whether an address belongs to mainnet or testnet. This is critical for preventing accidental transactions on the wrong network.

```csharp
var address = Address.FromBech32("addr1qy2jt0qpqgt...");
var network = address.NetworkId;

// Simple network check
if (network == NetworkId.Mainnet)
{
    Console.WriteLine("This is a mainnet address");
}
else if (network == NetworkId.Testnet)
{
    Console.WriteLine("This is a testnet address");
}

// Network validation for production
public void ValidateNetwork(Address address, bool isProduction)
{
    var expectedNetwork = isProduction ? NetworkId.Mainnet : NetworkId.Testnet;
    if (address.NetworkId != expectedNetwork)
    {
        throw new InvalidOperationException(
            $"Wrong network! Expected {expectedNetwork} but got {address.NetworkId}"
        );
    }
}

// Get network-specific configuration
var config = address.NetworkId switch
{
    NetworkId.Mainnet => MainnetConfig,
    NetworkId.Testnet => TestnetConfig,
    _ => throw new NotSupportedException($"Unknown network: {address.NetworkId}")
};
```

**Extracting Payment Credential:**

The payment credential controls who can spend funds from an address. It can be either a key hash (regular address) or script hash (smart contract).

```csharp
var paymentCred = address.PaymentCredential;

// Determine credential type
if (paymentCred.IsKeyHash)
{
    var keyHash = paymentCred.AsKeyHash();
    Console.WriteLine($"Payment key hash: {keyHash.ToHex()}");
    
    // Use for signature verification
    var requiredSigner = new TransactionBody.RequiredSigner(keyHash);
    
    // Check if matches a known key
    if (keyHash.Equals(myKeyHash))
    {
        Console.WriteLine("This is my address!");
    }
}
else if (paymentCred.IsScriptHash)
{
    var scriptHash = paymentCred.AsScriptHash();
    Console.WriteLine($"Script hash: {scriptHash.ToHex()}");
    
    // Look up script details
    var scriptInfo = await GetScriptInfo(scriptHash);
    Console.WriteLine($"Script type: {scriptInfo.Type}");
    Console.WriteLine($"Script language: {scriptInfo.Language}");
}

// Generic credential handling
public string GetCredentialInfo(Credential credential)
{
    return credential switch
    {
        { IsKeyHash: true } => $"Key: {credential.AsKeyHash().ToHex()}",
        { IsScriptHash: true } => $"Script: {credential.AsScriptHash().ToHex()}",
        _ => "Unknown credential type"
    };
}
```

**Extracting Staking Credential:**

The staking credential determines where rewards are directed and which stake pool the address delegates to.

```csharp
if (address.HasStakingCredential)
{
    var stakingCred = address.StakingCredential;
    
    if (stakingCred.IsKeyHash)
    {
        var stakeKeyHash = stakingCred.AsKeyHash();
        Console.WriteLine($"Stake key hash: {stakeKeyHash.ToHex()}");
        
        // Derive reward address
        var rewardAddress = Address.CreateReward(
            address.NetworkId,
            stakingCred
        );
        Console.WriteLine($"Reward address: {rewardAddress.ToBech32()}");
        
        // Check delegation status
        var delegation = await GetDelegation(stakeKeyHash);
        if (delegation != null)
        {
            Console.WriteLine($"Delegated to pool: {delegation.PoolId}");
        }
    }
    else if (stakingCred.IsScriptHash)
    {
        var stakeScriptHash = stakingCred.AsScriptHash();
        Console.WriteLine($"Stake script hash: {stakeScriptHash.ToHex()}");
        Console.WriteLine("Staking controlled by smart contract");
    }
}
else
{
    Console.WriteLine("No staking credential (Enterprise address)");
    Console.WriteLine("This address cannot earn staking rewards");
}

// Analyze staking setup
public StakingAnalysis AnalyzeStaking(Address address)
{
    return new StakingAnalysis
    {
        CanStake = address.HasStakingCredential,
        StakingType = address.StakingCredential?.IsKeyHash == true 
            ? "Key-based" : "Script-based",
        RewardAddress = address.HasStakingCredential
            ? Address.CreateReward(address.NetworkId, address.StakingCredential)
            : null
    };
}
```

**Getting Address Type:**

The address type affects functionality and use cases. Different types have different capabilities and limitations.

```csharp
var addressType = address.Type;

// Detailed type analysis
switch (addressType)
{
    case AddressType.Base:
        Console.WriteLine("Base address with payment and staking");
        Console.WriteLine("- Can receive funds: Yes");
        Console.WriteLine("- Can stake: Yes");
        Console.WriteLine("- Most common type: Yes");
        break;
        
    case AddressType.Enterprise:
        Console.WriteLine("Enterprise address without staking");
        Console.WriteLine("- Can receive funds: Yes");
        Console.WriteLine("- Can stake: No");
        Console.WriteLine("- Use case: Exchanges, smart contracts");
        break;
        
    case AddressType.Reward:
        Console.WriteLine("Reward address for staking rewards");
        Console.WriteLine("- Can receive funds: No (only rewards)");
        Console.WriteLine("- Can stake: N/A (is the staking address)");
        Console.WriteLine("- Use case: Receiving staking rewards");
        break;
        
    case AddressType.Byron:
        Console.WriteLine("Legacy Byron address");
        Console.WriteLine("⚠️ Deprecated - migrate to Shelley address");
        Console.WriteLine("- Can receive funds: Yes");
        Console.WriteLine("- Can stake: No");
        break;
}

// Type-based routing
public void ProcessAddress(Address address)
{
    var handler = address.Type switch
    {
        AddressType.Base => HandleBaseAddress,
        AddressType.Enterprise => HandleEnterpriseAddress,
        AddressType.Reward => HandleRewardAddress,
        AddressType.Byron => HandleByronAddress,
        _ => throw new NotSupportedException($"Unsupported address type: {address.Type}")
    };
    
    handler(address);
}
```

**Advanced Component Analysis:**

```csharp
// Comprehensive address analysis
public class AddressAnalysis
{
    public static AddressInfo Analyze(Address address)
    {
        return new AddressInfo
        {
            Bech32 = address.ToBech32(),
            Hex = address.ToHex(),
            Type = address.Type.ToString(),
            Network = address.NetworkId.ToString(),
            
            Payment = new CredentialInfo
            {
                Type = address.PaymentCredential.IsKeyHash ? "KeyHash" : "ScriptHash",
                Hash = address.PaymentCredential.IsKeyHash
                    ? address.PaymentCredential.AsKeyHash().ToHex()
                    : address.PaymentCredential.AsScriptHash().ToHex()
            },
            
            Staking = address.HasStakingCredential ? new CredentialInfo
            {
                Type = address.StakingCredential.IsKeyHash ? "KeyHash" : "ScriptHash",
                Hash = address.StakingCredential.IsKeyHash
                    ? address.StakingCredential.AsKeyHash().ToHex()
                    : address.StakingCredential.AsScriptHash().ToHex()
            } : null,
            
            Capabilities = new
            {
                CanReceiveFunds = address.Type != AddressType.Reward,
                CanStake = address.Type == AddressType.Base || address.Type == AddressType.Reward,
                RequiresScript = address.PaymentCredential.IsScriptHash,
                IsLegacy = address.Type == AddressType.Byron
            }
        };
    }
}
```

### Address Formats

Chrysalis supports multiple address formats to ensure compatibility with various systems and use cases. Understanding these formats is essential for integration with wallets, explorers, and other Cardano tools.

**Bech32 Format (Human-Readable):**

Bech32 is the standard human-readable format for Cardano addresses. It includes error detection through checksums and uses a limited character set to prevent confusion.

```csharp
var address = Address.CreateBase(
    NetworkId.Mainnet,
    paymentCredential,
    stakingCredential
);

// Convert to Bech32
string bech32 = address.ToBech32();
// Example output: addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x

// Get Bech32 with validation
public string GetBech32Safe(Address address)
{
    try
    {
        var bech32 = address.ToBech32();
        // Verify round-trip conversion
        var parsed = Address.FromBech32(bech32);
        if (!parsed.Equals(address))
        {
            throw new Exception("Bech32 conversion verification failed");
        }
        return bech32;
    }
    catch (Exception ex)
    {
        throw new InvalidOperationException($"Failed to convert to Bech32: {ex.Message}");
    }
}
```

Network-specific prefixes:
- Mainnet base/enterprise: `addr1...`
- Testnet base/enterprise: `addr_test1...`
- Mainnet stake: `stake1...`
- Testnet stake: `stake_test1...`
- Byron mainnet: `Ae2...`, `DdzFF...`, or `Addr...`

**Hexadecimal Format:**

Hex format is useful for low-level operations, storage, and debugging. It represents the raw bytes of the address as a hexadecimal string.

```csharp
// Convert to hex string
string hex = address.ToHex();
// Example: 019493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc

// Create from hex with validation
public Address ParseHexAddress(string hexString)
{
    // Validate hex string
    if (!Regex.IsMatch(hexString, "^[0-9a-fA-F]+$"))
    {
        throw new ArgumentException("Invalid hex string");
    }
    
    // Ensure even length
    if (hexString.Length % 2 != 0)
    {
        throw new ArgumentException("Hex string must have even length");
    }
    
    return Address.FromHex(hexString);
}

// Compare addresses using hex
var addr1Hex = address1.ToHex();
var addr2Hex = address2.ToHex();
var areEqual = addr1Hex.Equals(addr2Hex, StringComparison.OrdinalIgnoreCase);
```

**Binary Format:**

Binary format is the most compact representation and is used for network transmission and storage optimization.

```csharp
// Convert to byte array
byte[] bytes = address.ToBytes();
Console.WriteLine($"Address size: {bytes.Length} bytes");

// Create from bytes with error handling
public Address? TryParseBytes(byte[] bytes)
{
    try
    {
        return Address.FromBytes(bytes);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to parse address bytes: {ex.Message}");
        return null;
    }
}

// Store in database as binary
public void StoreAddress(Address address, string userId)
{
    using var connection = new SqlConnection(connectionString);
    var command = new SqlCommand(
        "INSERT INTO UserAddresses (UserId, AddressBytes) VALUES (@userId, @bytes)",
        connection
    );
    command.Parameters.AddWithValue("@userId", userId);
    command.Parameters.AddWithValue("@bytes", address.ToBytes());
    command.ExecuteNonQuery();
}
```

**CBOR Format:**

CBOR (Concise Binary Object Representation) is used for serialization in Cardano transactions and certificates.

```csharp
// Encode as CBOR
var cborBytes = address.ToCbor();
Console.WriteLine($"CBOR encoded size: {cborBytes.Length} bytes");
Console.WriteLine($"CBOR hex: {Convert.ToHexString(cborBytes)}");

// Decode from CBOR
var addressFromCbor = Address.FromCbor(cborBytes);

// Use in transaction metadata
var metadata = new TransactionMetadata();
metadata.Add(42, new MetadataMap
{
    { new MetadataText("recipient"), new MetadataBytes(address.ToCbor()) },
    { new MetadataText("amount"), new MetadataInt(1000000) }
});

// Verify CBOR round-trip
public bool VerifyCborSerialization(Address address)
{
    var cbor = address.ToCbor();
    var decoded = Address.FromCbor(cbor);
    return decoded.Equals(address);
}
```

**JSON Representation:**

JSON format is useful for APIs, configuration files, and web applications.

```csharp
// Convert to JSON-friendly format
var json = new
{
    bech32 = address.ToBech32(),
    hex = address.ToHex(),
    network = address.NetworkId.ToString(),
    type = address.Type.ToString(),
    payment = new
    {
        type = address.PaymentCredential.IsKeyHash ? "key" : "script",
        hash = address.PaymentCredential.IsKeyHash
            ? address.PaymentCredential.AsKeyHash().ToHex()
            : address.PaymentCredential.AsScriptHash().ToHex()
    },
    staking = address.HasStakingCredential ? new
    {
        type = address.StakingCredential.IsKeyHash ? "key" : "script",
        hash = address.StakingCredential.IsKeyHash
            ? address.StakingCredential.AsKeyHash().ToHex()
            : address.StakingCredential.AsScriptHash().ToHex()
    } : null
};

// Serialize to JSON string
var jsonString = JsonSerializer.Serialize(json, new JsonSerializerOptions
{
    WriteIndented = true
});

// Custom JSON converter
public class AddressJsonConverter : JsonConverter<Address>
{
    public override Address Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        return Address.IsValidBech32(value)
            ? Address.FromBech32(value)
            : Address.FromHex(value);
    }

    public override void Write(Utf8JsonWriter writer, Address value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToBech32());
    }
}
```

**Format Conversion Utilities:**

```csharp
public static class AddressFormatConverter
{
    public static Dictionary<string, string> ConvertToAllFormats(Address address)
    {
        return new Dictionary<string, string>
        {
            ["bech32"] = address.ToBech32(),
            ["hex"] = address.ToHex(),
            ["base64"] = Convert.ToBase64String(address.ToBytes()),
            ["cborHex"] = Convert.ToHexString(address.ToCbor())
        };
    }
    
    public static Address ParseAnyFormat(string value)
    {
        // Try Bech32 first (most common)
        if (value.StartsWith("addr") || value.StartsWith("stake"))
        {
            return Address.FromBech32(value);
        }
        
        // Try hex
        if (Regex.IsMatch(value, "^[0-9a-fA-F]+$"))
        {
            return Address.FromHex(value);
        }
        
        // Try Base64
        try
        {
            var bytes = Convert.FromBase64String(value);
            return Address.FromBytes(bytes);
        }
        catch
        {
            throw new ArgumentException($"Unrecognized address format: {value}");
        }
    }
}
```

---

## Address Validation

Validating addresses is crucial for security and preventing user errors. Chrysalis provides comprehensive validation capabilities:

**Basic Format Validation:**
```csharp
// Check if string is valid Bech32 address
if (Address.IsValidBech32("addr1..."))
{
    var address = Address.FromBech32("addr1...");
    Console.WriteLine("Valid address format");
}
else
{
    Console.WriteLine("Invalid address format");
}

// Validate with error details
try
{
    var address = Address.FromBech32(userInput);
}
catch (InvalidAddressException ex)
{
    Console.WriteLine($"Address validation failed: {ex.Message}");
    // Common errors:
    // - Invalid Bech32 encoding
    // - Wrong checksum
    // - Invalid prefix
    // - Incorrect length
}
```

**Network Validation:**
```csharp
// Ensure address matches expected network
var address = Address.FromBech32("addr1...");

if (address.NetworkId != NetworkId.Mainnet)
{
    throw new InvalidOperationException(
        $"Expected mainnet address but got {address.NetworkId}"
    );
}

// Network-aware validation
public bool IsValidForNetwork(string addressStr, NetworkId expectedNetwork)
{
    try
    {
        var address = Address.FromBech32(addressStr);
        return address.NetworkId == expectedNetwork;
    }
    catch
    {
        return false;
    }
}
```

**Address Type Validation:**
```csharp
// Validate specific address type
var address = Address.FromBech32("addr1...");

if (address.Type != AddressType.Base)
{
    throw new InvalidOperationException(
        $"Expected base address but got {address.Type}"
    );
}

// Check for script addresses
if (!address.PaymentCredential.IsScriptHash)
{
    throw new InvalidOperationException("Expected script address");
}
```

**Comprehensive Validation:**
```csharp
public class AddressValidator
{
    public ValidationResult ValidateAddress(
        string addressStr,
        NetworkId expectedNetwork,
        AddressType? expectedType = null,
        bool allowScriptAddress = true)
    {
        // Format validation
        if (!Address.IsValidBech32(addressStr))
        {
            return ValidationResult.Invalid("Invalid Bech32 format");
        }

        try
        {
            var address = Address.FromBech32(addressStr);

            // Network validation
            if (address.NetworkId != expectedNetwork)
            {
                return ValidationResult.Invalid(
                    $"Wrong network: expected {expectedNetwork}, got {address.NetworkId}"
                );
            }

            // Type validation
            if (expectedType.HasValue && address.Type != expectedType.Value)
            {
                return ValidationResult.Invalid(
                    $"Wrong type: expected {expectedType.Value}, got {address.Type}"
                );
            }

            // Script address validation
            if (!allowScriptAddress && address.PaymentCredential.IsScriptHash)
            {
                return ValidationResult.Invalid("Script addresses not allowed");
            }

            // Byron address check
            if (address.Type == AddressType.Byron)
            {
                return ValidationResult.Warning(
                    "Byron address detected - consider migrating to Shelley"
                );
            }

            return ValidationResult.Valid();
        }
        catch (Exception ex)
        {
            return ValidationResult.Invalid($"Validation error: {ex.Message}");
        }
    }
}
```

**Stake Pool Validation:**
```csharp
// Validate reward address for delegation
public bool IsValidRewardAddress(string addressStr)
{
    try
    {
        var address = Address.FromBech32(addressStr);
        return address.Type == AddressType.Reward;
    }
    catch
    {
        return false;
    }
}

// Validate address has staking capability
public bool CanStake(Address address)
{
    return address.Type == AddressType.Base || 
           address.Type == AddressType.Reward;
}
```

---

## Smart Contract Addresses

Smart contract addresses in Cardano are controlled by validator scripts rather than private keys. Chrysalis provides comprehensive support for working with script addresses:

**Creating Script Addresses:**
```csharp
// Create address from Plutus V2 script
var plutusScript = PlutusScript.FromCbor(scriptCbor);
var scriptHash = plutusScript.Hash();

var scriptAddress = Address.CreateBase(
    NetworkId.Mainnet,
    new PaymentCredential(scriptHash),
    stakingCredential  // Optional: can be null for enterprise
);

Console.WriteLine($"Script address: {scriptAddress.ToBech32()}");
Console.WriteLine($"Script hash: {scriptHash.ToHex()}");
```

**Different Script Types:**
```csharp
// Plutus V1 script address
var v1Script = PlutusV1Script.FromCbor(v1ScriptCbor);
var v1Address = Address.CreateEnterprise(
    NetworkId.Mainnet,
    new PaymentCredential(v1Script.Hash())
);

// Plutus V2 script address  
var v2Script = PlutusV2Script.FromCbor(v2ScriptCbor);
var v2Address = Address.CreateEnterprise(
    NetworkId.Mainnet,
    new PaymentCredential(v2Script.Hash())
);

// Native script (multi-sig) address
var nativeScript = NativeScript.RequireAllOf(
    NativeScript.RequireSignature(keyHash1),
    NativeScript.RequireSignature(keyHash2)
);
var multiSigAddress = Address.CreateEnterprise(
    NetworkId.Mainnet,
    new PaymentCredential(nativeScript.Hash())
);
```

**Identifying Script Addresses:**
```csharp
// Check if address is script-controlled
var address = Address.FromBech32("addr1...");

if (address.PaymentCredential.IsScriptHash)
{
    var scriptHash = address.PaymentCredential.AsScriptHash();
    Console.WriteLine($"Script-controlled address with hash: {scriptHash.ToHex()}");
    
    // This address requires script validation for spending
    // Must provide:
    // 1. The script itself
    // 2. Redeemer data
    // 3. Script context (datum)
}
else
{
    Console.WriteLine("Key-controlled address");
}

// Check staking credential
if (address.HasStakingCredential && address.StakingCredential.IsScriptHash)
{
    Console.WriteLine("Staking controlled by script");
}
```

**Script Address Patterns:**
```csharp
// Treasury/DAO pattern - script controls both payment and staking
var daoAddress = Address.CreateBase(
    NetworkId.Mainnet,
    new PaymentCredential(treasuryScriptHash),
    new StakingCredential(governanceScriptHash)
);

// Escrow pattern - script payment with user staking
var escrowAddress = Address.CreateBase(
    NetworkId.Mainnet,
    new PaymentCredential(escrowScriptHash),
    new StakingCredential(userStakeKeyHash)
);

// Pure script address - no staking
var pureScriptAddress = Address.CreateEnterprise(
    NetworkId.Mainnet,
    new PaymentCredential(scriptHash)
);
```

**Working with Script References:**
```csharp
// Reference scripts allow storing scripts on-chain
public class ScriptAddressBuilder
{
    public Address BuildReferenceScriptAddress(
        PlutusScript script,
        NetworkId network,
        StakingCredential? staking = null)
    {
        var scriptHash = script.Hash();
        
        // Store script hash for later reference
        StoreScriptReference(scriptHash, script);
        
        return staking != null
            ? Address.CreateBase(network, new PaymentCredential(scriptHash), staking)
            : Address.CreateEnterprise(network, new PaymentCredential(scriptHash));
    }
}
```

**Script Address Validation:**
```csharp
// Validate script address for specific use case
public bool IsValidScriptAddress(
    Address address,
    ScriptHash expectedScriptHash)
{
    if (!address.PaymentCredential.IsScriptHash)
    {
        return false;
    }
    
    var actualHash = address.PaymentCredential.AsScriptHash();
    return actualHash.Equals(expectedScriptHash);
}

// Check if address matches known script pattern
public ScriptType? IdentifyScriptType(Address address)
{
    if (!address.PaymentCredential.IsScriptHash)
        return null;
        
    var hash = address.PaymentCredential.AsScriptHash();
    
    // Check against known script patterns
    if (IsMultiSigPattern(hash))
        return ScriptType.MultiSig;
    else if (IsTimelockPattern(hash))
        return ScriptType.Timelock;
    else if (IsPlutusV2Pattern(hash))
        return ScriptType.PlutusV2;
    
    return ScriptType.Unknown;
}
```

**Advanced Script Address Features:**
```csharp
// Parameterized script addresses
public Address CreateParameterizedScriptAddress<T>(
    PlutusScript scriptTemplate,
    T parameters,
    NetworkId network)
{
    // Apply parameters to script
    var parameterizedScript = scriptTemplate.ApplyParameters(parameters);
    var scriptHash = parameterizedScript.Hash();
    
    return Address.CreateEnterprise(
        network,
        new PaymentCredential(scriptHash)
    );
}

// Script address with metadata
public class AnnotatedScriptAddress
{
    public Address Address { get; set; }
    public ScriptHash ScriptHash { get; set; }
    public string Purpose { get; set; }
    public DateTime CreatedAt { get; set; }
    public Dictionary<string, object> Metadata { get; set; }
}
```

---

## Next Steps

- [Transaction Model](./transaction-model) - Learn how addresses are used in Cardano transactions
- [CBOR Fundamentals](./cbor-fundamentals) - Explore the binary encoding format used for addresses
- [Cryptographic Primitives](./cryptographic-primitives) - Understand the cryptographic foundations of addresses
- [Quick Start Guide](../getting-started/quick-start) - Get started with practical examples using Chrysalis