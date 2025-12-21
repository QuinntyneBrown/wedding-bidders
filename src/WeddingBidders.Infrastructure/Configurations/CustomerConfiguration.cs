using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.CustomerAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");
        builder.HasKey(c => c.CustomerId);
        builder.Property(c => c.Firstname).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Lastname).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Email).IsRequired().HasMaxLength(256);
        builder.HasIndex(c => c.Email).IsUnique();
        builder.HasQueryFilter(c => !c.IsDeleted);

        builder.HasOne(c => c.Profile)
            .WithMany()
            .HasForeignKey(c => c.ProfileId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(c => c.Weddings)
            .WithOne(w => w.Customer)
            .HasForeignKey(w => w.CustomerId);
    }
}
