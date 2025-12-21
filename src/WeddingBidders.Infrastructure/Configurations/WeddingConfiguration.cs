using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.WeddingAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class WeddingConfiguration : IEntityTypeConfiguration<Wedding>
{
    public void Configure(EntityTypeBuilder<Wedding> builder)
    {
        builder.ToTable("Weddings");
        builder.HasKey(w => w.WeddingId);
        builder.Property(w => w.Location).IsRequired().HasMaxLength(500);
        builder.Property(w => w.NumberOfGuests).IsRequired();
        builder.Property(w => w.NumberOfHours).IsRequired();
        builder.Property(w => w.Date).IsRequired();
        builder.HasQueryFilter(w => !w.IsDeleted);

        builder.HasMany(w => w.Categories)
            .WithOne(c => c.Wedding)
            .HasForeignKey(c => c.WeddingId);

        builder.HasMany(w => w.Bids)
            .WithOne(b => b.Wedding)
            .HasForeignKey(b => b.WeddingId);
    }
}
