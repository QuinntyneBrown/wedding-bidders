using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.ProfileAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class ProfileConfiguration : IEntityTypeConfiguration<Profile>
{
    public void Configure(EntityTypeBuilder<Profile> builder)
    {
        builder.ToTable("Profiles");
        builder.HasKey(p => p.ProfileId);
        builder.Property(p => p.Firstname).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Lastname).IsRequired().HasMaxLength(100);
        builder.Property(p => p.PhoneNumber).HasMaxLength(20);
    }
}
