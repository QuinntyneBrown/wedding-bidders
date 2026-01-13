using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WeddingBidders.Wedding.Infrastructure.Configurations;

public class WeddingConfiguration : IEntityTypeConfiguration<Core.Model.Wedding>
{
    public void Configure(EntityTypeBuilder<Core.Model.Wedding> builder)
    {
        builder.HasKey(w => w.WeddingId);
        builder.Property(w => w.Location).IsRequired().HasMaxLength(500);
        builder.HasQueryFilter(w => !w.IsDeleted);

        builder.HasOne(w => w.Customer)
            .WithMany(c => c.Weddings)
            .HasForeignKey(w => w.CustomerId);

        builder.HasMany(w => w.Categories)
            .WithOne(c => c.Wedding)
            .HasForeignKey(c => c.WeddingId);
    }
}
