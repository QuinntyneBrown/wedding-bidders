using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Infrastructure.Configurations;

public class ProfileConfiguration : IEntityTypeConfiguration<Profile>
{
    public void Configure(EntityTypeBuilder<Profile> builder)
    {
        builder.HasKey(p => p.ProfileId);
        builder.HasQueryFilter(p => !p.IsDeleted);

        builder.HasOne(p => p.User)
            .WithMany(u => u.Profiles)
            .HasForeignKey(p => p.UserId);

        builder.HasOne(p => p.Account)
            .WithMany(a => a.Profiles)
            .HasForeignKey(p => p.AccountId);
    }
}
