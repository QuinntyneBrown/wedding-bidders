using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Infrastructure.Configurations;

public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.HasKey(a => a.AccountId);
        builder.HasQueryFilter(a => !a.IsDeleted);

        builder.HasMany(a => a.Profiles)
            .WithOne(p => p.Account)
            .HasForeignKey(p => p.AccountId);
    }
}
