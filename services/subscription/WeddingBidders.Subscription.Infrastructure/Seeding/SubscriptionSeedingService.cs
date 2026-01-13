using Microsoft.EntityFrameworkCore;
using WeddingBidders.Subscription.Core;
using WeddingBidders.Subscription.Core.Model;

namespace WeddingBidders.Subscription.Infrastructure.Seeding;

public class SubscriptionSeedingService
{
    private readonly ISubscriptionContext _context;

    public SubscriptionSeedingService(ISubscriptionContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        await SeedPlansAsync();
        await _context.SaveChangesAsync();
    }

    private async Task SeedPlansAsync()
    {
        if (await _context.Plans.AnyAsync())
            return;

        var plans = new List<Plan>
        {
            new()
            {
                PlanId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "Basic",
                Description = "Basic plan for new bidders",
                Price = 9.99m,
                DurationDays = 30
            },
            new()
            {
                PlanId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Name = "Professional",
                Description = "Professional plan with more features",
                Price = 29.99m,
                DurationDays = 30
            },
            new()
            {
                PlanId = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                Name = "Premium",
                Description = "Premium plan with all features",
                Price = 49.99m,
                DurationDays = 30
            }
        };

        _context.Plans.AddRange(plans);
    }
}
