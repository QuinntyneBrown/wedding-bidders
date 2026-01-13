using Microsoft.EntityFrameworkCore;
using WeddingBidders.Subscription.Core.Model;

namespace WeddingBidders.Subscription.Core;

public interface ISubscriptionContext
{
    DbSet<Model.Subscription> Subscriptions { get; }
    DbSet<Plan> Plans { get; }
    DbSet<Payment> Payments { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
