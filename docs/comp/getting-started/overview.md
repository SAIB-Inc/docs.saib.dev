---
title: Overview
sidebar_position: 1
hide_title: true
---

# Cardano Open Metadata Project

Cardano Open Metadata Project (COMP) is a comprehensive .NET library designed to simplify working with metadata on the Cardano blockchain. It provides a robust set of tools and abstractions for creating, parsing, and managing transaction metadata according to Cardano's metadata standards.

---

## What is Cardano Open Metadata Project?

On the Cardano blockchain, transaction metadata allows you to attach additional information to transactions. This metadata is stored on-chain forever and can contain various types of structured data. Common use cases include:

- **NFT Metadata**: Storing token attributes, images, and properties
- **Identity Verification**: Attaching KYC/AML information
- **Supply Chain**: Recording product journey and authenticity
- **Document Notarization**: Proving document existence at a specific time
- **Application-Specific Data**: Custom data for dApps and smart contracts

---

## Key Features

The COMP library provides:

### Type-Safe Metadata Construction
Build metadata using strongly-typed C# objects instead of raw JSON or CBOR manipulation. The library ensures your metadata conforms to Cardano's strict formatting requirements.

With COMP, you work with intuitive C# classes that represent metadata structures. The library handles all the complex type conversions and ensures compatibility with Cardano's metadata constraints:

```csharp
var metadata = new TransactionMetadata
{
    [721] = new MetadataObject
    {
        ["project"] = "MyNFTProject",
        ["version"] = 1,
        ["tokens"] = new MetadataArray { "token1", "token2" }
    }
};
```

Key benefits include:
- **Compile-time safety**: Catch metadata errors during development, not at runtime
- **IntelliSense support**: Full IDE assistance when constructing metadata
- **Automatic validation**: The library prevents invalid metadata structures
- **Fluent API**: Chain operations for cleaner, more readable code

### Standards Compliance
Built-in support for common metadata standards:
- **CIP-25**: NFT Metadata Standard
- **CIP-68**: Datum Metadata Standard  
- **CIP-20**: Transaction Message Standard

The library provides dedicated builders and validators for each supported standard, ensuring your metadata is fully compliant:

**CIP-25 NFT Metadata**: 
The library fully implements the CIP-25 standard for NFT metadata, which defines how to structure token names, images, descriptions, and custom attributes. It handles the required 721 metadata label, policy ID organization, and asset-specific properties. The implementation ensures proper formatting for marketplace compatibility and supports both simple and complex NFT collections with traits, royalties, and media references.

**CIP-68 Reference NFTs**: 
Support for the reference NFT standard that separates token metadata from the token itself, enabling updateable metadata and improved scalability. This standard uses a two-token approach where a reference token holds the metadata in its datum, allowing for gas-efficient updates without burning and reminting. The library manages the reference token prefixes (100 for reference tokens, 222 for user tokens) and handles the datum structure requirements automatically.

**CIP-20 Transaction Messages**: 
The CIP-20 standard enables attaching human-readable messages to transactions using the metadata label 674. The library provides automatic message encoding, size optimization to fit within transaction limits, and optional encryption support. It handles message chunking for longer content and ensures proper UTF-8 encoding while maintaining compatibility with wallet applications that display transaction messages.

### Serialization and Parsing
- Convert between C# objects and CBOR format
- Parse existing on-chain metadata
- Validate metadata against size limits
- Handle complex nested structures

The library provides powerful serialization capabilities that handle the complexity of Cardano's CBOR-encoded metadata format:

**Automatic CBOR Encoding**: 
The library seamlessly converts your C# objects into CBOR format, which is the binary encoding required by Cardano. It handles all primitive types, collections, and nested structures automatically. The encoding process ensures compliance with Cardano's deterministic CBOR requirements and provides both byte array and hexadecimal string outputs for different use cases.

**Parsing On-Chain Metadata**: 
When retrieving metadata from the blockchain, the library provides robust parsing capabilities that deserialize CBOR-encoded data back into strongly-typed C# objects. It includes safe value extraction methods that handle missing keys gracefully, type conversions with proper error handling, and support for navigating complex nested structures. The parser validates the CBOR format and provides meaningful error messages for malformed data.

**Size Validation**: 
Cardano enforces strict size limits on metadata with a maximum of 16KB per transaction. The library includes comprehensive validation that checks your metadata size before submission, calculates the exact CBOR-encoded size, and provides detailed validation results including the actual size and any constraint violations. This prevents failed transactions due to oversized metadata and helps optimize metadata structure when approaching size limits.

**Complex Structure Support**:
The library handles deeply nested metadata with arrays, maps, and mixed types while maintaining type safety and Cardano compliance. It supports arbitrary nesting depth, heterogeneous collections with different value types, and automatic handling of Cardano-specific encoding rules. The implementation ensures that complex data structures are properly encoded according to CBOR canonical format requirements.

### Integration Ready
Designed to work seamlessly with other SAIB tools:
- Use with **Chrysalis** for transaction building
- Index metadata with **Argus** for querying
- Compatible with standard Cardano node APIs

COMP is built as a core component of the SAIB ecosystem, ensuring smooth integration with your existing Cardano development workflow:

**Chrysalis Integration**
Attach metadata directly to transactions built with Chrysalis:
```csharp
var transaction = new TransactionBuilder()
    .AddInput(utxo)
    .AddOutput(recipient, amount)
    .AttachMetadata(metadata) // Seamless metadata attachment
    .Build();
```

**Argus Indexing**
Query and analyze metadata at scale using Argus:
```csharp
// Index NFT metadata for fast retrieval
var nfts = await argusClient.Query<NFTMetadata>()
    .Where(m => m.PolicyId == policyId)
    .Where(m => m.Attributes["rarity"] == "legendary")
    .ToListAsync();
```

**Node API Compatibility**
Works directly with Cardano node endpoints and existing infrastructure:
```csharp
// Submit via standard node API
var txId = await nodeClient.SubmitTransaction(
    transaction.ToCborHex()
);
```

The library also provides extension methods for popular Cardano .NET libraries, making it easy to add metadata support to your existing applications.

---

## Architecture

The library follows a clean architecture pattern with clear separation of concerns. Each module is designed with single responsibility in mind, promoting maintainability and extensibility. The modular structure allows developers to use only the components they need while ensuring all parts work together seamlessly.

```
COMP
├── Core/              # Core metadata models and interfaces
├── Standards/         # Implementation of CIP standards
├── Serialization/     # CBOR encoding/decoding
├── Validation/        # Metadata validation rules
└── Extensions/        # Helper methods and utilities
```

**Core**: Defines base classes like MetadataObject, MetadataArray, and the fundamental types that represent Cardano metadata structures. This module provides the foundation for all metadata operations and ensures type consistency throughout the library.

**Standards**: Contains specialized implementations for each Cardano Improvement Proposal (CIP) related to metadata. It includes dedicated builders and validators for CIP-25, CIP-68, and CIP-20, ensuring compliance with established Cardano standards.

**Serialization**: Handles conversion between .NET objects and CBOR binary format required by Cardano. This module ensures deterministic encoding and provides both low-level byte manipulation and high-level object serialization APIs.

**Validation**: Enforces Cardano's metadata constraints including size limits, structure requirements, and type restrictions. It provides comprehensive validation logic with detailed error messages to help developers debug metadata issues.

**Extensions**: Offers convenience methods and extension functions that simplify common metadata operations. This module includes integration helpers for other SAIB tools and popular third-party Cardano libraries.

---

## Why Use Cardano Open Metadata Project?

### Developer Friendly
Skip the complexity of manual CBOR encoding. Work with familiar C# objects and let the library handle the low-level details. The intuitive API design means you can start building metadata-enabled applications immediately without deep knowledge of Cardano's binary formats. Comprehensive documentation and IntelliSense support guide you through every step of the development process.

### Production Ready
Built with enterprise applications in mind, featuring comprehensive error handling, validation, and logging capabilities. The library has been battle-tested in production environments and includes features like automatic retry logic, connection pooling, and detailed diagnostic information. Performance optimizations ensure minimal overhead even when processing large volumes of metadata transactions.

### Actively Maintained
As part of the SAIB ecosystem, COMP receives regular updates to support new Cardano features and metadata standards. The development team actively monitors Cardano Improvement Proposals (CIPs) and implements support for new standards as they emerge. Community feedback and contributions are welcomed, with a responsive support system for addressing issues and feature requests.