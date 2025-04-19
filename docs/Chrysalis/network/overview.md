---
title: Overview
sidebar_position: 1
---

<!-- network/architecture-overview.md -->
# Architecture & Overview

Chrysalis.Network is a .NET implementation of Cardano’s Ouroboros network stack. It provides:

- **Transport Bearers**: Abstracted socket I/O (TCP/Unix) exposed as `PipeReader`/`PipeWriter`.
- **Multiplexing Layer**: Concurrent mini-protocol streams on a single connection, framed per spec.
- **Mini-Protocol Handlers**: Typed channels for Handshake, ChainSync, TxSubmission, StateQuery, etc.
- **CBOR Serialization**: Zero-reflection serializers generated from `[CborSerializable]` types.

**Workflow (NodeClient):**
1. Connect via TCP or Unix bearer.  
2. Perform Handshake (ID 0) to negotiate versions and network magic.  
3. Subscribe protocols on a shared multiplexer/demuxer via `AgentChannel`.  
4. Drive each protocol asynchronously (sync blocks, submit txs, query state).

This design mirrors the Ouroboros spec’s layered transport, mux, and protocol strata.

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

<!-- network/protocols.md -->
# Mini‑Protocol Specifications & Channels

| Protocol               | ID  | Purpose                                              |
|------------------------|-----|------------------------------------------------------|
| Handshake              | 0   | Version negotiation                                  |
| ChainSync (Node/Client)| 2/5 | Header-only / full-block sync                       |
| BlockFetch             | 3   | Fetch block bodies (node-to-node)                   |
| TxSubmission (Node)    | 4   | Gossip-style tx propagation                         |
| LocalTxSubmission      | 6   | Submit a transaction from client to node            |
| LocalStateQuery        | 7   | Query node’s on-chain state                         |
| KeepAlive              | 8   | Ping/pong liveness checks (node-to-node)            |
| LocalTxMonitor         | 9   | Mempool status & notifications                      |
| PeerSharing            | 10  | Exchange peer lists (future support)                |

**Handler pattern:**
- **Send**: `await channel.SendFullMessageAsync<RequestType>(requestObj);`
- **Receive**: `var resp = await channel.ReceiveFullMessageAsync<ResponseType>();`

Channels map 1:1 with spec’s protocol IDs and message schemas.

---

<!-- network/examples-troubleshooting.md -->
# Examples & Troubleshooting

## Usage Example
```csharp
// Connect & Handshake// Connect & Handshake\using var client = await NodeClient.ConnectTcpAsync("127.0.0.1", 3001);
await client.Handshake.SendAsync(HandshakeMessages.ProposeVersions(magic));

// ChainSync
var sync = client.CreateChainSync();
await sync.FindIntersectionAsync(new[] { genesisPoint });
while (true) {
  var update = await sync.NextAsync();
  if (update is RollForward rf) HandleBlock(rf.Block);
  else HandleRollback(((RollBackward)update).Point);
}

// Submit a transaction
var submit = client.CreateLocalTxSubmission();
var result = await submit.SubmitTxAsync(new SubmitTx(txBytes));
Console.WriteLine(result);
```

## Troubleshooting
- **Handshake Failure**: Verify matching protocol versions and correct network magic.
- **Missing Data**: Subscribe the protocol channel before sending; unsubscribed IDs are dropped.
- **Back-pressure Hangs**: Ensure you call `ReceiveFullMessageAsync` to drain buffers.
- **CBOR Errors**: Check that `ChannelBuffer` splits messages ≤ 64 KB correctly.
- **Connection Issues**: Validate host/port, Unix socket paths, firewall permissions.

Enable detailed logs on `IBearer` and `Plexer` to trace I/O and framing issues.

