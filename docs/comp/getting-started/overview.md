---
title: Overview
sidebar_position: 1
hide_title: true
---

# Cardano Metadata

Cardano.Metadata is a comprehensive .NET library designed to simplify working with metadata on the Cardano blockchain. It provides a robust set of tools and abstractions for creating, parsing, and managing transaction metadata according to Cardano's metadata standards.

## What is Cardano Metadata?

On the Cardano blockchain, transaction metadata allows you to attach additional information to transactions. This metadata is stored on-chain forever and can contain various types of structured data. Common use cases include:

- **NFT Metadata**: Storing token attributes, images, and properties
- **Identity Verification**: Attaching KYC/AML information
- **Supply Chain**: Recording product journey and authenticity
- **Document Notarization**: Proving document existence at a specific time
- **Application-Specific Data**: Custom data for dApps and smart contracts

## Key Features

The Cardano.Metadata library provides:

### Type-Safe Metadata Construction
Build metadata using strongly-typed C# objects instead of raw JSON or CBOR manipulation. The library ensures your metadata conforms to Cardano's strict formatting requirements.

### Standards Compliance
Built-in support for common metadata standards:
- **CIP-25**: NFT Metadata Standard
- **CIP-68**: Datum Metadata Standard  
- **CIP-20**: Transaction Message Standard
- Custom metadata formats

### Serialization and Parsing
- Convert between C# objects and CBOR format
- Parse existing on-chain metadata
- Validate metadata against size limits
- Handle complex nested structures

### Integration Ready
Designed to work seamlessly with other SAIB tools:
- Use with **Chrysalis** for transaction building
- Index metadata with **Argus** for querying
- Compatible with standard Cardano node APIs

## Architecture

The library follows a clean architecture pattern with clear separation of concerns:

```
Cardano.Metadata
├── Core/              # Core metadata models and interfaces
├── Standards/         # Implementation of CIP standards
├── Serialization/     # CBOR encoding/decoding
├── Validation/        # Metadata validation rules
└── Extensions/        # Helper methods and utilities
```

## Why Use Cardano.Metadata?

### Developer Friendly
Skip the complexity of manual CBOR encoding. Work with familiar C# objects and let the library handle the low-level details.

### Production Ready
Built with enterprise applications in mind, featuring comprehensive error handling, validation, and logging capabilities.

### Actively Maintained
As part of the SAIB ecosystem, Cardano.Metadata receives regular updates to support new Cardano features and metadata standards.