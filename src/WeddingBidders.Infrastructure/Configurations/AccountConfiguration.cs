using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.AccountAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ToTable("Accounts");
        builder.HasKey(a => a.AccountId);
        builder.Property(a => a.Firstname).IsRequired().HasMaxLength(100);
        builder.Property(a => a.Lastname).IsRequired().HasMaxLength(100);
        builder.Property(a => a.Email).IsRequired().HasMaxLength(256);
        builder.HasIndex(a => a.Email).IsUnique();
        builder.HasQueryFilter(a => !a.IsDeleted);

        builder.HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(a => a.Profiles)
            .WithOne(p => p.Account)
            .HasForeignKey(p => p.AccountId);
    }
}
