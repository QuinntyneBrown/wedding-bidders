using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.BidderAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class GalleryConfiguration : IEntityTypeConfiguration<Gallery>
{
    public void Configure(EntityTypeBuilder<Gallery> builder)
    {
        builder.ToTable("Galleries");
        builder.HasKey(g => g.GalleryId);
        builder.Property(g => g.Name).IsRequired().HasMaxLength(256);
        builder.Property(g => g.Description).HasMaxLength(1000);
        builder.Property(g => g.ImageUrl).HasMaxLength(500);
        builder.HasQueryFilter(g => !g.IsDeleted);
    }
}
