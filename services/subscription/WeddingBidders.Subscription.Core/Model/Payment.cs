using WeddingBidders.Shared.Core;

namespace WeddingBidders.Subscription.Core.Model;

public class Payment : BaseEntity
{
    public Guid PaymentId { get; set; }
    public Guid SubscriptionId { get; set; }
    public Subscription? Subscription { get; set; }
    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }
    public string? TransactionId { get; set; }
}

public enum PaymentStatus
{
    Pending = 0,
    Completed = 1,
    Failed = 2,
    Refunded = 3
}
