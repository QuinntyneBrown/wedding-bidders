using MessagePack;

namespace WeddingBidders.Shared.Core.Events;

[MessagePackObject]
public class SubscriptionCreatedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid SubscriptionId { get; set; }

    [Key(4)]
    public Guid AccountId { get; set; }

    [Key(5)]
    public Guid PlanId { get; set; }

    [Key(6)]
    public DateTime EffectiveDate { get; set; }

    [Key(7)]
    public DateTime ExpiryDate { get; set; }
}

[MessagePackObject]
public class PaymentProcessedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid PaymentId { get; set; }

    [Key(4)]
    public Guid SubscriptionId { get; set; }

    [Key(5)]
    public decimal Amount { get; set; }

    [Key(6)]
    public string Status { get; set; } = string.Empty;
}
