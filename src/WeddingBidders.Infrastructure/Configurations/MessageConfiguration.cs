using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.MessageAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("Messages");
        builder.HasKey(m => m.MessageId);
        builder.Property(m => m.Subject).HasMaxLength(256);
        builder.Property(m => m.Content).IsRequired().HasMaxLength(4000);
        builder.HasQueryFilter(m => !m.IsDeleted);
    }
}
