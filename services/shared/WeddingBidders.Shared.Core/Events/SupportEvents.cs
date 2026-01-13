using MessagePack;

namespace WeddingBidders.Shared.Core.Events;

[MessagePackObject]
public class IssueCreatedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid IssueId { get; set; }

    [Key(4)]
    public Guid ReportedByProfileId { get; set; }

    [Key(5)]
    public string Subject { get; set; } = string.Empty;

    [Key(6)]
    public string Content { get; set; } = string.Empty;
}

[MessagePackObject]
public class IssueResolvedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid IssueId { get; set; }

    [Key(4)]
    public string Resolution { get; set; } = string.Empty;
}
