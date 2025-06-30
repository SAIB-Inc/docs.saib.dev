---
sidebar_position: 2
title: Core Concepts
---

# Core Concepts

This guide explores the technical concepts and implementation details for working with Cardano metadata in the Cardano.Metadata library. Understanding these core concepts is essential for building applications that interact with on-chain metadata, from simple transaction messages to complex NFT collections and decentralized identity systems. The library provides a comprehensive .NET implementation of Cardano's metadata standards, ensuring your applications remain compliant with protocol rules while maintaining flexibility for future evolution.

---

## Metadata Structure

Cardano metadata follows a hierarchical key-value structure that enables flexible data storage within transactions. Understanding this structure is fundamental to working with on-chain metadata effectively.

### Data Model

Cardano's metadata data model provides a flexible yet structured approach to storing information on-chain. The model is designed to balance expressiveness with protocol efficiency and security.

#### Core Architecture

The metadata structure consists of a top-level map with the following characteristics:

**1. Key Space**
- **Type**: Unsigned integers (metadata labels)
- **Range**: 0 to 65535 (16-bit unsigned integer)
- **Purpose**: Labels categorize metadata by type and standard
- **Uniqueness**: Each key must be unique at the top level

**2. Value Types**
- **Primitive Types**: Integers, strings, and byte arrays
- **Composite Types**: Lists and maps for complex structures
- **Recursive Nesting**: Values can contain other values up to 1000 levels deep
- **Type Mixing**: Lists can contain different types of elements

**3. Size Constraints**
- **Total Size**: Maximum 16KB per transaction
- **String Length**: Maximum 64 bytes per individual string
- **Nesting Depth**: Maximum 1000 levels of recursion
- **No Entry Limit**: Unlimited number of metadata entries within size constraint

#### Hierarchical Organization

```
Transaction Metadata
├── Label (Integer Key)
│   └── Value (Any Type)
│       ├── Primitive Value
│       └── Composite Value
│           ├── Map
│           │   └── Key-Value Pairs
│           └── List
│               └── Elements
```

#### Design Rationale

The data model design reflects several key decisions:

1. **Integer Keys**: Using integers instead of strings for top-level keys reduces storage overhead and enables efficient categorization

2. **Type Flexibility**: Supporting mixed types in lists allows for more natural data representation

3. **Size Limits**: The 16KB limit ensures transactions remain propagatable across the network while the 64-byte string limit prevents abuse

4. **CBOR Encoding**: Binary encoding provides efficiency while maintaining self-description capabilities

### Supported Data Types

#### Primitive Types
1. **Integers**: Arbitrary precision integers for numeric values
2. **Strings**: UTF-8 encoded text with a 64-byte limit per string
3. **Byte Arrays**: Raw binary data for hashes, signatures, or encoded content

#### Composite Types
4. **Lists**: Ordered collections that can contain mixed types
5. **Maps**: Key-value pairs for structured data organization

---

## Metadata Labels

Metadata labels are integer identifiers that categorize different types of on-chain data according to their purpose and structure. These labels enable applications to efficiently identify and process specific metadata types without parsing entire transaction contents.

### Standard Label Registry

The most commonly used metadata labels in the Cardano ecosystem:

| Label | Purpose                    | Standard | Description                                                           |
|-------|----------------------------|----------|-----------------------------------------------------------------------|
| 674   | Transaction Messages       | CIP-20   | Human-readable messages attached to transactions                      |
| 721   | NFT Metadata               | CIP-25   | Primary label for NFT metadata, widely supported across ecosystem    |
| 100   | User Token (CIP-68)        | CIP-68   | Identifies user-held tokens in the reference/user token pattern      |
| 222   | Reference Token (CIP-68)   | CIP-68   | Marks reference tokens containing updateable metadata                 |
| 777   | Royalty Information        | CIP-27   | Defines royalty rates and recipient addresses for NFTs               |
| 1967  | Arbitrary Metadata         | -        | General-purpose label for custom application data                     |

### Label Selection Guidelines

When choosing metadata labels for your application:

1. **Use Standard Labels**: Prefer established CIP labels for maximum interoperability
2. **Check Conflicts**: Verify your chosen label isn't already used by another standard
3. **Document Usage**: Clearly document custom label usage in your application
4. **Consider Range**: Labels 0-999 are typically reserved for CIP standards

---

## Standards Implementation

The Cardano ecosystem has developed various metadata standards through Cardano Improvement Proposals (CIPs) to ensure interoperability across applications. The Cardano.Metadata library provides comprehensive support for these standards.

### CIP-25: NFT Metadata Standard

CIP-25 establishes the foundational standard for NFT metadata on Cardano, enabling consistent parsing and display across wallets and marketplaces.

#### Structure and Required Fields

The CIP-25 standard defines a specific JSON structure that must be followed for NFT metadata. The structure uses label 721 and organizes NFTs by policy ID and asset name.

**Required Fields:**
- **name** (string): The display name of the NFT, shown in wallets and marketplaces
- **image** (string): URI pointing to the NFT's primary image (supports ipfs://, https://, ar://)
- **mediaType** (string): MIME type of the image (e.g., "image/png", "image/jpeg", "image/gif")

**Optional Common Fields:**
- **description** (string): Detailed description of the NFT
- **files** (array): Additional media files associated with the NFT
- **attributes** (object): Trait-based properties for rarity systems

```json
{
  "721": {
    "<policy_id>": {
      "<asset_name>": {
        "name": "My NFT",
        "image": "ipfs://...",
        "description": "A unique digital asset",
        "mediaType": "image/png"
      }
    }
  }
}
```

**Key Structure Notes:**
- The policy_id must be the actual minting policy ID (56 characters hex)
- The asset_name is the on-chain token name (often hex-encoded)
- All string values must respect the 64-byte limit (use arrays for longer content)

#### Extended Properties

CIP-25 supports additional properties for richer NFT experiences. These extended properties enable advanced features like multiple file formats, detailed attributes for rarity systems, and additional media content.

**Common Extended Properties:**

1. **files** (array): Additional media files beyond the main image
   - Each file object contains: name, mediaType, and src
   - Used for high-resolution versions, 3D models, audio, or video content
   - Enables multi-format NFTs (e.g., image + video + 3D model)

2. **attributes** (object): Key-value pairs for traits and properties
   - Used by marketplaces for filtering and rarity calculations
   - Can include any custom properties (e.g., "Background", "Rarity", "Power Level")
   - Values can be strings, numbers, or booleans

3. **version** (string): Metadata standard version indicator
   - Helps applications handle different metadata formats
   - Currently "1.0" for CIP-25

```json
{
  "721": {
    "policy_id_here": {
      "AssetName001": {
        "name": "Exclusive NFT #001",
        "image": "ipfs://QmXxxxx",
        "mediaType": "image/png",
        "description": "Limited edition digital artwork",
        "files": [
          {
            "name": "highres.png",
            "mediaType": "image/png",
            "src": "ipfs://QmYyyy"
          },
          {
            "name": "animated.mp4",
            "mediaType": "video/mp4", 
            "src": "ipfs://QmZzzz"
          }
        ],
        "attributes": {
          "Background": "Cosmic",
          "Rarity": "Legendary",
          "Edition": 1,
          "Artist": "CryptoArtist",
          "Collection": "Exclusive Series"
        },
        "version": "1.0"
      }
    }
  }
}
```

**Additional Extended Properties:**
- **website** (string): Project or artist website URL
- **copyright** (string): Copyright information
- **publisher** (array): Publisher details for collections
- Any custom properties specific to your NFT project

### CIP-68: Datum Metadata Standard

CIP-68 revolutionizes metadata management by storing data in smart contract datums rather than transaction metadata, offering significant advantages for dynamic NFTs and complex applications.

#### Architecture Overview
The standard employs a two-token system:
1. **Reference Token (222 label)**: Locked in a smart contract with metadata in its datum
2. **User Token (100 label)**: The tradeable NFT held by users

#### Implementation Benefits
- **Updateable Metadata**: Modify attributes without burning tokens
- **Unlimited Size**: Datum storage bypasses the 16KB transaction limit
- **Smart Contract Integration**: Enable programmable NFTs with on-chain logic
- **Efficient Queries**: Reference tokens provide a single source of truth

### CIP-20: Transaction Message Standard

CIP-20 enables human-readable messages within transactions, supporting various communication use cases on-chain. Originally designed for simple messaging, it has evolved to support structured communication between wallets, applications, and users.

#### Supported Labels
- **Label 20**: Original CIP-20 specification
- **Label 674**: Community-adopted alternative (more widely used)

#### Message Structure and Fields

**Basic Message Format:**
- **msg** (array): Array of strings containing the message content
- Messages longer than 64 bytes must be split across multiple array elements
- Each array element must respect the 64-byte UTF-8 limit

**Extended Message Format:**
- **metadata** (object): Additional structured data
- Can include custom fields for application-specific data
- Supports nested objects and arrays within size constraints

#### Message Format Options

**Simple Message Format:**
```json
{
  "674": {
    "msg": ["This is a transaction message"]
  }
}
```

**Multi-line Message (Long Content Split):**
```json
{
  "674": {
    "msg": [
      "This is a longer message that exceeds the 64-byte limit,",
      " so it must be split across multiple array elements to",
      " comply with Cardano metadata constraints."
    ]
  }
}
```

**Structured Message with Metadata:**
```json
{
  "674": {
    "msg": ["Payment for services rendered"],
    "metadata": {
      "invoice": "INV-2024-001",
      "reference": "Contract ABC",
      "amount": 1000,
      "currency": "ADA"
    }
  }
}
```

#### Common Use Cases
1. **Payment References**: Invoice numbers, order IDs, payment descriptions
2. **Communication**: Messages between users, notifications, alerts
3. **Application Data**: Game moves, voting rationale, system events
4. **Documentation**: Transaction purposes, audit trails, compliance notes

### CIP-27: Royalty Metadata Standard

CIP-27 defines how royalty information is attached to NFTs, enabling creators to receive ongoing compensation from secondary sales. This standard ensures consistent royalty implementation across marketplaces and applications.

#### Required Fields
- **rate** (string): Royalty percentage as a decimal string (e.g., "0.05" for 5%)
- **addr** (string): Bech32-encoded Cardano address to receive royalty payments

#### Optional Fields
- **version** (string): Standard version identifier
- **splits** (array): Multiple recipients for royalty distribution
- **expires** (integer): Unix timestamp when royalties expire

#### Royalty Structure Examples

**Simple Royalty:**
```json
{
  "777": {
    "rate": "0.05",        // 5% royalty rate
    "addr": "addr1qxy2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj83ws8lhrn648jjxtwq2ytjmm"
  }
}
```

**Multiple Recipients (Split Royalties):**
```json
{
  "777": {
    "rate": "0.075",       // 7.5% total royalty
    "splits": [
      {
        "addr": "addr1qxy...",  // Artist address
        "pct": "0.6"           // 60% of royalty (4.5% of sale)
      },
      {
        "addr": "addr1qab...",  // Platform address  
        "pct": "0.4"           // 40% of royalty (3% of sale)
      }
    ]
  }
}
```

**Time-Limited Royalties:**
```json
{
  "777": {
    "rate": "0.025",       // 2.5% royalty rate
    "addr": "addr1qxy...",
    "expires": 1735689600  // Expires Jan 1, 2025
  }
}
```

#### Implementation Considerations
1. **Rate Format**: Always use string format for decimal precision
2. **Address Validation**: Ensure addresses are valid Cardano addresses
3. **Marketplace Support**: Not all marketplaces honor royalties automatically
4. **Split Validation**: Percentage splits should sum to 1.0 (100%)

### CIP-60: Music NFT Metadata

CIP-60 extends CIP-25 to provide specialized metadata fields for music NFTs, enabling rich audio experiences and proper music industry metadata. This standard supports everything from individual tracks to full albums and audiovisual content.

#### Music-Specific Fields

**Core Music Metadata:**
- **artist** (string): Primary artist or band name
- **album** (string): Album or collection name
- **genre** (string): Musical genre classification
- **duration** (integer): Track duration in seconds
- **release_date** (string): Release date in ISO 8601 format
- **track_number** (integer): Position in album/playlist

**Extended Music Fields:**
- **lyrics** (array): Song lyrics split into manageable chunks
- **credits** (object): Producer, composer, and contributor information
- **isrc** (string): International Standard Recording Code
- **copyright** (string): Copyright holder information
- **mood** (string): Emotional tone or mood descriptor
- **tempo** (integer): Beats per minute (BPM)

#### Complete Music NFT Example
```json
{
  "721": {
    "policy_id": {
      "ElectronicSong001": {
        "name": "Neon Dreams",
        "image": "ipfs://QmAlbumCover123",
        "mediaType": "image/png",
        "description": "An electrifying journey through synthetic soundscapes",
        "files": [
          {
            "name": "neon_dreams.mp3",
            "mediaType": "audio/mp3",
            "src": "ipfs://QmAudioFile123"
          },
          {
            "name": "neon_dreams_hq.flac", 
            "mediaType": "audio/flac",
            "src": "ipfs://QmAudioFileHQ456"
          },
          {
            "name": "music_video.mp4",
            "mediaType": "video/mp4",
            "src": "ipfs://QmVideoFile789"
          }
        ],
        "music_metadata": {
          "artist": "SynthWave Producer",
          "album": "Digital Horizons",
          "genre": "Electronic/Synthwave",
          "duration": 247,
          "release_date": "2024-01-15",
          "track_number": 3,
          "tempo": 128,
          "mood": "Energetic",
          "isrc": "US-ABC-24-12345",
          "credits": {
            "producer": "SynthWave Producer",
            "mixer": "Audio Engineer Pro",
            "mastered_by": "Master Studios"
          }
        },
        "attributes": {
          "Rarity": "Rare",
          "Edition": "1 of 100",
          "Key": "C Minor",
          "Instruments": "Synthesizer, Drum Machine"
        }
      }
    }
  }
}
```

#### Album Collections
For album NFTs, additional fields help organize track collections:
```json
{
  "music_metadata": {
    "album_type": "LP",           // LP, EP, Single
    "total_tracks": 12,
    "disc_number": 1,
    "compilation": false,
    "record_label": "Indie Records"
  }
}
```

--- 

## Metadata Encoding

Metadata is encoded using CBOR (Concise Binary Object Representation) format, which provides:
- Compact binary representation for efficient storage
- Self-describing format that preserves type information
- Support for nested structures up to 1000 levels deep

### CBOR Encoding Details

CBOR is a binary data serialization format designed for small message size, extensibility, and self-description. For Cardano metadata:

1. **Type Preservation**: CBOR maintains the distinction between integers, strings, byte arrays, lists, and maps
2. **Deterministic Encoding**: The same metadata always produces the same binary representation
3. **Efficient Storage**: Binary format reduces on-chain storage requirements compared to JSON
4. **Language Agnostic**: CBOR libraries exist for all major programming languages

### Deserialization Considerations

When deserializing CBOR metadata:
- Validate the structure against protocol constraints
- Handle malformed data gracefully
- Preserve original types (don't convert integers to strings)
- Check for maximum nesting depth during parsing