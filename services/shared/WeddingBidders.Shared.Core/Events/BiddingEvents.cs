using MessagePack;

namespace WeddingBidders.Shared.Core.Events;

[MessagePackObject]
public class BidderRegisteredEvent : IntegrationEvent
{
    [Key(3)]
    public Guid BidderId { get; set; }

    [Key(4)]
    public Guid ProfileId { get; set; }

    [Key(5)]
    public string Email { get; set; } = string.Empty;

    [Key(6)]
    public string CompanyName { get; set; } = string.Empty;

    [Key(7)]
    public string BidderType { get; set; } = string.Empty;
}

[MessagePackObject]
public class BidCreatedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid BidId { get; set; }

    [Key(4)]
    public Guid WeddingId { get; set; }

    [Key(5)]
    public Guid BidderId { get; set; }

    [Key(6)]
    public decimal Price { get; set; }

    [Key(7)]
    public string Description { get; set; } = string.Empty;
}

[MessagePackObject]
public class BidAcceptedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid BidId { get; set; }

    [Key(4)]
    public Guid WeddingId { get; set; }

    [Key(5)]
    public Guid BidderId { get; set; }
}
