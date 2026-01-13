using Microsoft.EntityFrameworkCore;
using WeddingBidders.Messaging.Core;
using WeddingBidders.Messaging.Core.Model;

namespace WeddingBidders.Messaging.Infrastructure;

public class MessagingContext : DbContext, IMessagingContext
{
    public MessagingContext(DbContextOptions<MessagingContext> options) : base(options)
    {
    }

    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<ConversationProfile> ConversationProfiles => Set<ConversationProfile>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(m => m.MessageId);
            entity.Property(m => m.Content).IsRequired();
            entity.HasQueryFilter(m => !m.IsDeleted);
        });

        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.HasKey(c => c.ConversationId);
            entity.HasQueryFilter(c => !c.IsDeleted);
            entity.HasMany(c => c.Messages)
                .WithOne(m => m.Conversation)
                .HasForeignKey(m => m.ConversationId);
        });

        modelBuilder.Entity<ConversationProfile>(entity =>
        {
            entity.HasKey(cp => new { cp.ConversationId, cp.ProfileId });
            entity.HasOne(cp => cp.Conversation)
                .WithMany(c => c.Profiles)
                .HasForeignKey(cp => cp.ConversationId);
        });

        base.OnModelCreating(modelBuilder);
    }
}
