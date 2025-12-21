using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.BidAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class BidConfiguration : IEntityTypeConfiguration<Bid>
{
    public void Configure(EntityTypeBuilder<Bid> builder)
    {
        builder.ToTable("Bids");
        builder.HasKey(b => b.BidId);
        builder.Property(b => b.Description).IsRequired().HasMaxLength(2000);
        builder.Property(b => b.Price).IsRequired().HasPrecision(18, 2);
        builder.HasQueryFilter(b => !b.IsDeleted);
    }
}
