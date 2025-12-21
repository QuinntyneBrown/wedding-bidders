using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.UserAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class PrivilegeConfiguration : IEntityTypeConfiguration<Privilege>
{
    public void Configure(EntityTypeBuilder<Privilege> builder)
    {
        builder.ToTable("Privileges");
        builder.HasKey(p => p.PrivilegeId);
        builder.Property(p => p.Aggregate).IsRequired().HasMaxLength(100);
    }
}
