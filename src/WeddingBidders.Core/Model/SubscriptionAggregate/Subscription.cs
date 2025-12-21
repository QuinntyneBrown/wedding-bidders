namespace WeddingBidders.Core.Model.SubscriptionAggregate;

public class Subscription
{
    public Guid SubscriptionId { get; set; }
    public Guid AccountId { get; set; }
    public Guid PlanId { get; set; }
    public DateTime EffectiveDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
