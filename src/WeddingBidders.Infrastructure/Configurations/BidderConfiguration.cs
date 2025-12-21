using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.BidderAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class BidderConfiguration : IEntityTypeConfiguration<Bidder>
{
    public void Configure(EntityTypeBuilder<Bidder> builder)
    {
        builder.ToTable("Bidders");
        builder.HasKey(b => b.BidderId);
        builder.Property(b => b.Firstname).IsRequired().HasMaxLength(100);
        builder.Property(b => b.Lastname).IsRequired().HasMaxLength(100);
        builder.Property(b => b.Email).IsRequired().HasMaxLength(256);
        builder.Property(b => b.CompanyName).HasMaxLength(256);
        builder.Property(b => b.Description).HasMaxLength(2000);
        builder.HasIndex(b => b.Email).IsUnique();
        builder.HasQueryFilter(b => !b.IsDeleted);

        builder.HasOne(b => b.Profile)
            .WithMany()
            .HasForeignKey(b => b.ProfileId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(b => b.Galleries)
            .WithOne(g => g.Bidder)
            .HasForeignKey(g => g.BidderId);

        builder.HasMany(b => b.Bids)
            .WithOne(bid => bid.Bidder)
            .HasForeignKey(bid => bid.BidderId);
    }
}
