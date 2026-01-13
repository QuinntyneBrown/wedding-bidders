using WeddingBidders.Shared.Core;

namespace WeddingBidders.Subscription.Core.Model;

public class Subscription : BaseEntity
{
    public Guid SubscriptionId { get; set; }
    public Guid AccountId { get; set; }
    public Guid PlanId { get; set; }
    public Plan? Plan { get; set; }
    public DateTime EffectiveDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public SubscriptionStatus Status { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

public enum SubscriptionStatus
{
    Active = 0,
    Expired = 1,
    Cancelled = 2
}
