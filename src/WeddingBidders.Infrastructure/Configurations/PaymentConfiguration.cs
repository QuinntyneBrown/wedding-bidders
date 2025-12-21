using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.SubscriptionAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");
        builder.HasKey(p => p.PaymentId);
        builder.Property(p => p.Amount).IsRequired().HasPrecision(18, 2);
        builder.Property(p => p.PaymentDate).IsRequired();
        builder.HasQueryFilter(p => !p.IsDeleted);
    }
}
