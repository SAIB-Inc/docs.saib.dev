---
title: Handshake
sidebar_position: 1
---

# Handshake Mini-Protocol 

The Handshake protocol runs immediately after opening a connection to negotiate a mutually supported protocol version and confirm the network magic (identifier). No other mini-protocols may exchange data until the handshake completes successfully.

Under the hood:
- The **initiator** sends a `ProposeVersions` message listing supported version numbers and the desired network magic value.
- The **responder** replies with either:
  - `AcceptVersion`, selecting one of the proposed versions, or
  - `Refuse`, indicating no common version was found (connection is then closed).

This behavior aligns with Section 3.1 of the Ouroboros network specification.

---

## Example
```csharp
// 1. Establish connection and start protocols
NodeClient client = await NodeClient.ConnectAsync(_socketPath);
await client.StartAsync();

// 2. Build version proposal (Node-to-Client v10+)
var propose = HandshakeMessages.ProposeVersions(
    VersionTables.N2C_V10_AND_ABOVE(myNetworkMagic)
);

// 3. Send proposal and await response
var response = await client.Handshake!
    .SendAsync(propose, CancellationToken.None);

```

Once the handshake completes with `AcceptVersion`, the client may proceed to subscribe and run other mini-protocols (ChainSync, LocalTxSubmission, etc.) over the same connection. Feel free to adjust the version table to include additional versions or custom network magic values.

