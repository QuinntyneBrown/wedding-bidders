using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Bidding.Core.Model;

namespace WeddingBidders.Bidding.Infrastructure.Configurations;

public class GalleryConfiguration : IEntityTypeConfiguration<Gallery>
{
    public void Configure(EntityTypeBuilder<Gallery> builder)
    {
        builder.HasKey(g => g.GalleryId);
        builder.Property(g => g.Title).IsRequired().HasMaxLength(200);
        builder.Property(g => g.Description).HasMaxLength(1000);
        builder.Property(g => g.Url).IsRequired().HasMaxLength(500);
    }
}
