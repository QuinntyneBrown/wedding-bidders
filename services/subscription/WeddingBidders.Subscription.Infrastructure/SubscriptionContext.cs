using Microsoft.EntityFrameworkCore;
using WeddingBidders.Subscription.Core;
using WeddingBidders.Subscription.Core.Model;

namespace WeddingBidders.Subscription.Infrastructure;

public class SubscriptionContext : DbContext, ISubscriptionContext
{
    public SubscriptionContext(DbContextOptions<SubscriptionContext> options) : base(options)
    {
    }

    public DbSet<Core.Model.Subscription> Subscriptions => Set<Core.Model.Subscription>();
    public DbSet<Plan> Plans => Set<Plan>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Core.Model.Subscription>(entity =>
        {
            entity.HasKey(s => s.SubscriptionId);
            entity.HasQueryFilter(s => !s.IsDeleted);
            entity.HasOne(s => s.Plan).WithMany(p => p.Subscriptions).HasForeignKey(s => s.PlanId);
            entity.HasMany(s => s.Payments).WithOne(p => p.Subscription).HasForeignKey(p => p.SubscriptionId);
        });

        modelBuilder.Entity<Plan>(entity =>
        {
            entity.HasKey(p => p.PlanId);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Price).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(p => p.PaymentId);
            entity.Property(p => p.Amount).HasPrecision(18, 2);
            entity.HasQueryFilter(p => !p.IsDeleted);
        });

        base.OnModelCreating(modelBuilder);
    }
}
