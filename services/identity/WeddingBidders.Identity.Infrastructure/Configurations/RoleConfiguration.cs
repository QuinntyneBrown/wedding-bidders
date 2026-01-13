using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Infrastructure.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(r => r.RoleId);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(100);
        builder.HasIndex(r => r.Name).IsUnique();
        builder.HasQueryFilter(r => !r.IsDeleted);

        builder.HasMany(r => r.Privileges)
            .WithOne(p => p.Role)
            .HasForeignKey(p => p.RoleId);
    }
}
