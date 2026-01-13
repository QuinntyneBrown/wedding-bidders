using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Bidding.Core.Model;

namespace WeddingBidders.Bidding.Infrastructure.Configurations;

public class BidConfiguration : IEntityTypeConfiguration<Bid>
{
    public void Configure(EntityTypeBuilder<Bid> builder)
    {
        builder.HasKey(b => b.BidId);
        builder.Property(b => b.Price).HasPrecision(18, 2);
        builder.Property(b => b.Description).HasMaxLength(2000);
        builder.HasQueryFilter(b => !b.IsDeleted);
    }
}
