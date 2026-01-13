using MessagePack;

namespace WeddingBidders.Shared.Core.Events;

[MessagePackObject]
public abstract class IntegrationEvent
{
    [Key(0)]
    public Guid EventId { get; set; } = Guid.NewGuid();

    [Key(1)]
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [Key(2)]
    public string EventType => GetType().Name;
}
