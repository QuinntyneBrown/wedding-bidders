namespace WeddingBidders.Core.Model.SubscriptionAggregate;

public class Plan
{
    public Guid PlanId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
