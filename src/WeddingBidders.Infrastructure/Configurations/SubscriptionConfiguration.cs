using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.SubscriptionAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.ToTable("Subscriptions");
        builder.HasKey(s => s.SubscriptionId);
        builder.Property(s => s.EffectiveDate).IsRequired();
        builder.Property(s => s.ExpiryDate).IsRequired();
        builder.HasQueryFilter(s => !s.IsDeleted);

        builder.HasMany(s => s.Payments)
            .WithMany();
    }
}
