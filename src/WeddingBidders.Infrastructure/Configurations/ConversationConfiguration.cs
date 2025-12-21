using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.MessageAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class ConversationConfiguration : IEntityTypeConfiguration<Conversation>
{
    public void Configure(EntityTypeBuilder<Conversation> builder)
    {
        builder.ToTable("Conversations");
        builder.HasKey(c => c.ConversationId);
        builder.HasQueryFilter(c => !c.IsDeleted);

        builder.HasMany(c => c.Messages)
            .WithOne(m => m.Conversation)
            .HasForeignKey(m => m.ConversationId);

        builder.HasMany(c => c.Profiles)
            .WithMany(p => p.Conversations)
            .UsingEntity(j => j.ToTable("ConversationProfiles"));
    }
}
