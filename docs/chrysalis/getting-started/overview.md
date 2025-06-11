---
title: Overview
sidebar_position: 1
hide_title: true
---

![Chrysalis Banner](/img/docs/chrysalis/banner.png)

---

## What is Chrysalis?

Chrysalis is a native.NET toolkit for Cardano blockchain development that includes everything you need to build Cardano applications. Chrysalis provides a complete solution for.NET developers, including CBOR serialization, transaction generation, and smart contract interaction.

---

## Key Components

Chrysalis is built around several core components that work together to provide a complete Cardano development toolkit:

- **CBOR Serialization** - Encode and decode Cardano data structures with type-safe models
- **Node Communication** - Direct interaction with Cardano nodes via Ouroboros mini-protocols
- **Wallet Management** - Generate addresses and handle cryptographic key operations
- **Transaction Building** - Construct simple and advanced transactions with a fluent API
- **Smart Contract Integration** - Evaluate and interact with Plutus scripts via Rust FFI

---

## Features

Chrysalis delivers enterprise-grade performance and developer experience for building Cardano applications in .NET. The toolkit combines the power of native .NET with optimized implementations to provide a fast, reliable, and intuitive development experience:

- **Type-Safe Data Models** - Strongly-typed representations of all Cardano data structures with compile-time safety
- **High Performance** - Benchmarked faster than Rust-based alternatives with optimized memory usage
- **Modular Architecture** - Install only the components you need via individual NuGet packages
- **Modern C# API** - Fluent interfaces, async/await patterns, and extension methods for developer productivity
- **Multi-Era Support** - Compatible with all Cardano eras from Byron through Babbage and beyond

#### Type-Safe Data Models

Chrysalis provides comprehensive type definitions for all Cardano data structures, from basic primitives to complex governance proposals. Every type is strongly-typed with proper null-safety annotations, ensuring that common runtime errors are caught at compile time. The models include automatic validation, bounds checking, and proper serialization attributes, making it virtually impossible to create invalid Cardano data structures in your application.

#### High Performance

Performance is a core design principle of Chrysalis. Through careful optimization of hot paths, efficient memory allocation strategies, and minimal object copying, Chrysalis achieves throughput that exceeds even native Rust implementations in many scenarios. The CBOR serialization engine uses stackalloc and `Span<T>` extensively to minimize heap allocations, while the networking layer employs zero-copy techniques for processing large blocks and transaction batches.

#### Modular Architecture

Each Chrysalis component is published as a separate NuGet package, allowing developers to include only what they need. Building a simple wallet? Just reference Chrysalis.Wallet. Need to interact with smart contracts? Add Chrysalis.Plutus. This modular approach keeps application size minimal and reduces potential attack surface. All modules follow semantic versioning and maintain backward compatibility within major versions.

#### Modern C# API

Chrysalis embraces modern C# features and idioms to provide an intuitive developer experience. Transaction building uses a fluent interface that guides developers through the construction process. All I/O operations support async/await for efficient resource utilization. Extension methods provide convenient shortcuts for common operations, while still allowing full control when needed. The API design follows .NET naming conventions and integrates seamlessly with popular frameworks like ASP.NET Core.

#### Multi-Era Support

Cardano has evolved through multiple eras—Byron, Shelley, Allegra, Mary, Alonzo, Babbage—each adding new features and capabilities. Chrysalis abstracts these differences, providing a unified API that works across all eras while still exposing era-specific features when needed. The library automatically handles era detection, feature negotiation, and protocol version selection, ensuring your applications continue to work as the Cardano network evolves.

---

## Architecture

Chrysalis follows a layered architecture design where each module builds upon lower-level components while maintaining clear separation of concerns. This modular approach ensures maximum flexibility and reusability:

| Module | Description |
|--------|-------------|
| **Chrysalis.Cbor** | CBOR serialization for Cardano data structures |
| **Chrysalis.Cbor.CodeGen** | Source generation for optimized serialization code |
| **Chrysalis.Network** | Implementation of Ouroboros mini-protocols |
| **Chrysalis.Tx** | Transaction building and submission |
| **Chrysalis.Plutus** | Smart contract evaluation and validation |
| **Chrysalis.Wallet** | Key management and address handling |

#### Chrysalis.Cbor

The foundation of all Cardano data handling, this module implements the Concise Binary Object Representation (CBOR) format as specified by RFC 7049 with Cardano-specific extensions. It provides high-performance serialization and deserialization for all Cardano primitives including integers, byte strings, arrays, maps, and tagged values. The module features automatic handling of indefinite-length arrays, canonical CBOR encoding for transaction hashing, and specialized support for Cardano's unique data structures like plutus data and native scripts.

#### Chrysalis.Cbor.CodeGen

A compile-time code generation module that analyzes your data models and generates optimized serialization code using C# source generators. This eliminates reflection overhead and produces serialization code that rivals hand-written implementations in performance. The generated code includes specialized fast-paths for common patterns, stackalloc optimizations for small objects, and vectorized operations where applicable. Developers simply annotate their classes with attributes, and the generator handles the rest.

#### Chrysalis.Network

Implements the full Ouroboros family of mini-protocols for direct communication with Cardano nodes. This includes the handshake protocol for version negotiation, chain-sync for following the blockchain, block-fetch for retrieving specific blocks, local-tx-submission for sending transactions, and local-state-query for querying the current ledger state. The module handles all the complexity of the multiplexed binary protocol, automatic reconnection, and protocol state machines while exposing a simple async API to consumers.

#### Chrysalis.Tx

A comprehensive transaction construction toolkit that simplifies the complex process of building valid Cardano transactions. It provides both high-level helpers for common operations (simple ADA transfers, NFT minting) and low-level builders for advanced use cases. The module automatically handles coin selection using various strategies, fee calculation with accurate script cost estimation, and transaction balancing. It includes built-in validation to ensure transactions meet all ledger rules before submission.

#### Chrysalis.Plutus

Enables interaction with Cardano's smart contract platform by providing script evaluation, datum handling, and redeemer construction. The module uses Rust FFI bindings to the official Cardano plutus evaluator, ensuring perfect compatibility with on-chain execution. It supports both Plutus V1 and V2 scripts, provides cost model management, and includes utilities for working with script contexts, datum hashes, and inline datums. The API abstracts the complexity of UPLC while still providing access to low-level details when needed.

#### Chrysalis.Wallet

Provides all cryptographic operations needed for Cardano applications including key generation, address derivation, and transaction signing. The module implements BIP32 hierarchical deterministic wallets, BIP39 mnemonic phrases, and CIP-1852 address derivation paths. It supports all Cardano address types (payment, stake, script, pointer), multi-signature schemes, and hardware wallet integration. Security is paramount with keys stored in protected memory and cleared after use.

---

## Performance

Chrysalis sets a new standard for blockchain processing performance in the .NET ecosystem, consistently outperforming implementations in other languages including Rust. Extensive benchmarking using BenchmarkDotNet with proper warm-up cycles, multiple iterations, and statistical analysis demonstrates Chrysalis's superior throughput and efficiency.

### Benchmark Results

Performance comparisons between Chrysalis (.NET) and Pallas (Rust) show significant advantages across key metrics:

#### Block Processing Speed

| Scenario | Chrysalis (.NET) | Pallas (Rust) | Performance Gain |
|----------|------------------|---------------|------------------|
| **With Database Operations** | 609.56 blocks/sec | 474.95 blocks/sec | **+28.3%** |
| **Without Database Operations** | 4,500 blocks/sec | 3,500 blocks/sec | **+28.6%** |

#### Key Performance Metrics

- **Deserialization Speed**: Approximately 28% faster block deserialization compared to Rust implementations
- **Memory Efficiency**: Lower memory footprint through aggressive pooling and span-based operations
- **Scalability**: Excellent performance characteristics maintained even under high-throughput scenarios
- **Chain Sync**: Optimized synchronization protocols reduce network overhead and processing time

### Performance Optimizations

The exceptional performance of Chrysalis comes from several architectural decisions and optimizations:

#### 1. Zero-Copy Deserialization
Chrysalis minimizes memory allocations by parsing CBOR data directly from byte buffers without intermediate copies. Using `ReadOnlySpan<byte>` and `Memory<T>` throughout the codebase, the deserializer can process multi-megabyte blocks without heap allocations. This approach is particularly effective for large transactions and script witnesses where traditional deserializers would create thousands of temporary objects.

#### 2. Vectorized Operations
Where applicable, Chrysalis leverages SIMD (Single Instruction, Multiple Data) instructions through System.Runtime.Intrinsics. Hash calculations, byte array comparisons, and CBOR integer decoding all benefit from vectorization. On modern CPUs with AVX2 support, this can process 32 bytes in the same time traditional code processes 4 bytes.

#### 3. Object Pooling
High-frequency objects like transaction inputs, outputs, and CBOR readers are managed through `ArrayPool<T>` and custom object pools. This dramatically reduces Generation 0 garbage collections—benchmarks show a 75% reduction in GC pressure compared to naive implementations. The pooling strategy adapts to workload patterns, expanding during peak usage and contracting during idle periods.

#### 4. Async I/O Pipeline
Network operations use `System.IO.Pipelines` for efficient async I/O with minimal allocations. The pipeline processes Ouroboros protocol messages in a streaming fashion, parsing headers before bodies arrive and overlapping network I/O with CBOR deserialization. This enables Chrysalis to maintain multiple concurrent chain-sync connections without thread blocking.

#### 5. JIT Optimizations
Chrysalis is designed to take full advantage of .NET's tiered JIT compilation. Hot paths are structured to enable aggressive inlining, loop unrolling, and devirtualization. Profile-guided optimization (PGO) further improves performance by up to 15% in production scenarios. The codebase includes strategic use of `[MethodImpl(MethodImplOptions.AggressiveInlining)]` and `[SkipLocalsInit]` attributes where profiling indicates benefits.

---

## Cardano Era Support

Chrysalis provides comprehensive support across Cardano's evolutionary eras, ensuring your applications remain compatible as the network evolves. Each era introduces new capabilities and features, and Chrysalis abstracts these complexities while still providing access to era-specific functionality when needed.

### Supported Eras

| Era | Status | Key Features | Chrysalis Support |
|-----|--------|--------------|-------------------|
| **Byron** | 🚧 Work in Progress | Foundation era, basic UTxO model | Limited - No serialization or transaction building |
| **Shelley** | ✅ Full Support | Decentralization, staking, delegation | Complete implementation including stake pool operations |
| **Allegra** | ✅ Full Support | Token locking, validity intervals | Full support for time-locked transactions |
| **Mary** | ✅ Full Support | Native tokens, multi-asset | Comprehensive multi-asset handling and minting |
| **Alonzo** | ✅ Full Support | Smart contracts, Plutus scripts | Complete Plutus V1/V2 integration |
| **Babbage/Vasil** | ✅ Full Support | Reference inputs, inline datums, reference scripts | All CIPs implemented including optimizations |
| **Conway** | ✅ Full Support | On-chain governance, DReps | Full governance action support |

### Era-Specific Features

#### Byron Era (Foundation)
Currently under development, Byron era support will include:
- Legacy address formats for backward compatibility
- Byron-era transaction parsing for historical data analysis
- Migration utilities for upgrading Byron UTxOs

#### Shelley Era (Decentralization)
- Stake pool registration and retirement transactions
- Delegation certificate creation
- Reward address generation and withdrawal handling
- Pool metadata management

#### Allegra Era (Token Locking)
- Validity interval before/after for time-locked transactions
- Transaction TTL (Time to Live) handling
- Script-based time locking

#### Mary Era (Multi-Asset)
- Native token minting and burning
- Multi-asset transaction building
- Token bundle management
- Metadata attachment for NFTs

#### Alonzo Era (Smart Contracts)
- Plutus V1 script evaluation and validation
- Datum and redeemer construction
- Collateral input handling
- Script cost calculation

#### Babbage/Vasil Era (Scaling)
- Reference inputs for reading without spending
- Inline datums for simplified script interactions
- Reference scripts for reduced transaction sizes
- Plutus V2 with additional built-ins

#### Conway Era (Governance)
- Governance action creation and voting
- DRep registration and delegation
- Constitutional committee interactions
- Treasury withdrawals and protocol parameter updates

### Automatic Era Detection

Chrysalis automatically detects the current era when connecting to a Cardano node and adjusts its behavior accordingly. This includes:

- Protocol version negotiation during handshake
- Feature availability checks before operations
- Automatic fallback for backward compatibility
- Era-specific validation rules

### Future Era Support

Chrysalis is designed with extensibility in mind, allowing rapid adoption of new Cardano features as they are released. The modular architecture ensures that new era support can be added without breaking existing functionality, maintaining backward compatibility for applications built on earlier versions.

---