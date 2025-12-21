using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.InvitationTokenAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class InvitationTokenConfiguration : IEntityTypeConfiguration<InvitationToken>
{
    public void Configure(EntityTypeBuilder<InvitationToken> builder)
    {
        builder.ToTable("InvitationTokens");
        builder.HasKey(t => t.InvitationTokenId);
        builder.Property(t => t.Value).IsRequired().HasMaxLength(256);
        builder.HasIndex(t => t.Value).IsUnique();
    }
}
