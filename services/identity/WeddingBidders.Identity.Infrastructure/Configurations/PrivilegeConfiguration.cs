using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Infrastructure.Configurations;

public class PrivilegeConfiguration : IEntityTypeConfiguration<Privilege>
{
    public void Configure(EntityTypeBuilder<Privilege> builder)
    {
        builder.HasKey(p => p.PrivilegeId);
        builder.Property(p => p.Aggregate).IsRequired().HasMaxLength(100);
    }
}
