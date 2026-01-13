namespace WeddingBidders.Subscription.Core.Model;

public class Plan
{
    public Guid PlanId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DurationDays { get; set; }
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
