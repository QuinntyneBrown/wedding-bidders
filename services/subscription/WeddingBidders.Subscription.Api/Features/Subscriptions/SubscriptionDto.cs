namespace WeddingBidders.Subscription.Api.Features.Subscriptions;

public class SubscriptionDto
{
    public Guid SubscriptionId { get; set; }
    public Guid AccountId { get; set; }
    public Guid PlanId { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public DateTime EffectiveDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class PlanDto
{
    public Guid PlanId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DurationDays { get; set; }
}

public static class SubscriptionExtensions
{
    public static SubscriptionDto ToDto(this Core.Model.Subscription subscription)
    {
        return new SubscriptionDto
        {
            SubscriptionId = subscription.SubscriptionId,
            AccountId = subscription.AccountId,
            PlanId = subscription.PlanId,
            PlanName = subscription.Plan?.Name ?? string.Empty,
            EffectiveDate = subscription.EffectiveDate,
            ExpiryDate = subscription.ExpiryDate,
            Status = subscription.Status.ToString()
        };
    }

    public static PlanDto ToDto(this Core.Model.Plan plan)
    {
        return new PlanDto
        {
            PlanId = plan.PlanId,
            Name = plan.Name,
            Description = plan.Description,
            Price = plan.Price,
            DurationDays = plan.DurationDays
        };
    }
}
