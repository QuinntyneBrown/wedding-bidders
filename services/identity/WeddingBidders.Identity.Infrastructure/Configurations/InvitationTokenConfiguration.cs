using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Infrastructure.Configurations;

public class InvitationTokenConfiguration : IEntityTypeConfiguration<InvitationToken>
{
    public void Configure(EntityTypeBuilder<InvitationToken> builder)
    {
        builder.HasKey(t => t.InvitationTokenId);
        builder.Property(t => t.Token).IsRequired().HasMaxLength(255);
        builder.HasIndex(t => t.Token).IsUnique();
        builder.HasQueryFilter(t => !t.IsDeleted);
    }
}
