---
title: Transport
sidebar_position: 2
---

# Transport Layer: Bearers, Multiplexer & Codecs, Connection

## Bearers (Raw I/O)
- `IBearer` abstracts TCP and Unix sockets, providing `PipeReader`/`PipeWriter`.
- `TcpBearer` wraps `TcpClient`; `UnixBearer` wraps a Unix domain `Socket`.

## Multiplexer & Codecs
1. **Muxer**: Reads frames (1-byte ID + 2-byte length + payload), prepends an 8-byte header (timestamp, mode bit, protocol ID, payload length), encodes via `MuxSegmentCodec`, and writes to bearer.
2. **Demuxer**: Parses incoming headers, extracts payloads, and routes each to its `AgentChannel` pipe, dropping unknown IDs.
3. **ChannelBuffer**: Splits CBOR messages >64 KB into segments; reassembles and invokes CBOR serialize/deserialize.

## Connection Setup
```csharp
using var client = await NodeClient.ConnectTcpAsync(host, port);
var plexer = new Plexer(bearer, ProtocolMode.Initiator);
// Handshake
await plexer.SubscribeClient(ProtocolType.Handshake)
             .WriteAsync(HandshakeMessages.ProposeVersions(magic));
await plexer.Handshake.ReceiveAsync();
// Subscribe other protocols
var chainSyncChannel = plexer.SubscribeClient(ProtocolType.ClientChainSync);
```  
This initializes the bearer, mux/demux, and protocol channels in a single session.

---