using MessagePack;

namespace WeddingBidders.Shared.Core.Events;

[MessagePackObject]
public class MessageSentEvent : IntegrationEvent
{
    [Key(3)]
    public Guid MessageId { get; set; }

    [Key(4)]
    public Guid ConversationId { get; set; }

    [Key(5)]
    public Guid FromProfileId { get; set; }

    [Key(6)]
    public Guid ToProfileId { get; set; }

    [Key(7)]
    public string Content { get; set; } = string.Empty;
}

[MessagePackObject]
public class ConversationCreatedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid ConversationId { get; set; }

    [Key(4)]
    public List<Guid> ProfileIds { get; set; } = new();
}
