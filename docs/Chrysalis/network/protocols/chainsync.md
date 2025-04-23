---
title: ChainSync
sidebar_position: 2
---

# ChainSync Mini-Protocol

The ChainSync protocol streams full blocks from a Cardano node to a client, ensuring the client’s ledger view stays in sync with the chain tip. It supports both roll‑forward (new blocks) and roll‑back (forks) scenarios.

**Spec Reference:** Section 3.17 of the Ouroboros network specification (node-to-client ChainSync).

## Protocol Flow

1. **FindIntersect**: Client sends a `FindIntersect` message with a list of known points (block headers or hashes).
2. **Intersect Response**: Server replies with
   - `IntersectFound(point, tip)` if a common point exists, or
   - `IntersectNotFound(tip)` otherwise.
3. **NextRequest Loop**: Client repeatedly issues `NextRequest` messages.
   - `RollForward(block, tip)`: New block available.
   - `RollBackward(point, tip)`: Chain rollback to an earlier point.

The client must process each update before sending the next request, following the spec’s state-machine.

---

## Example

```csharp
// 1. Connect and start the client
NodeClient client = await NodeClient.ConnectAsync(_configuration.SocketPath);
await client.StartAsync();

// 2. Establish an intersection point
var point = new Point(
    _configuration.IntersectionPoint.Slot,
    Convert.FromHexString(_configuration.IntersectionPoint.Hash)
);
await client.ChainSync!
    .FindIntersectionAsync(new[] { point }, _cancellationTokenSource.Token);

// 3. Start streaming updates in the background
while (!_cancellationTokenSource.Token.IsCancellationRequested)
{
    try
    {
        var update = await client.ChainSync.NextRequestAsync(_cancellationTokenSource.Token);

        switch (update)
        {
            case RollBackward rb:
                // TODO: handle rollback to rb.Point
                _logger.LogInformation("Rollback to slot {Slot}", rb.Point.Slot);
                break;

            case RollForward rf:
                // TODO: process new block rf.Block
                _logger.LogInformation("New block at slot {Slot}", rf.Block.Header.HeaderBody.Slot);
                break;

            default:
                // Idle or await reply
                _logger.LogInformation("Awaiting new blocks at tip");
                break;
        }
    }
    catch (OperationCanceledException)
    {
        break;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error processing ChainSync message");
        await Task.Delay(1000, _cancellationTokenSource.Token);
    }

};
```
