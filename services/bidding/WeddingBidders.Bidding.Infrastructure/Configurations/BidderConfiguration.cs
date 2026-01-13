using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Bidding.Core.Model;

namespace WeddingBidders.Bidding.Infrastructure.Configurations;

public class BidderConfiguration : IEntityTypeConfiguration<Bidder>
{
    public void Configure(EntityTypeBuilder<Bidder> builder)
    {
        builder.HasKey(b => b.BidderId);
        builder.Property(b => b.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(b => b.LastName).IsRequired().HasMaxLength(100);
        builder.Property(b => b.Email).IsRequired().HasMaxLength(255);
        builder.Property(b => b.CompanyName).HasMaxLength(200);
        builder.Property(b => b.Description).HasMaxLength(2000);
        builder.HasIndex(b => b.Email).IsUnique();
        builder.HasQueryFilter(b => !b.IsDeleted);

        builder.HasMany(b => b.Galleries)
            .WithOne(g => g.Bidder)
            .HasForeignKey(g => g.BidderId);

        builder.HasMany(b => b.Bids)
            .WithOne(bid => bid.Bidder)
            .HasForeignKey(bid => bid.BidderId);
    }
}
