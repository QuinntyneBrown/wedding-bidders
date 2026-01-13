using Microsoft.EntityFrameworkCore;
using WeddingBidders.Messaging.Core.Model;

namespace WeddingBidders.Messaging.Core;

public interface IMessagingContext
{
    DbSet<Message> Messages { get; }
    DbSet<Conversation> Conversations { get; }
    DbSet<ConversationProfile> ConversationProfiles { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
