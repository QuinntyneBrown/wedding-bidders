using WeddingBidders.Shared.Core;

namespace WeddingBidders.Messaging.Core.Model;

public class Conversation : BaseEntity
{
    public Guid ConversationId { get; set; }
    public ICollection<ConversationProfile> Profiles { get; set; } = new List<ConversationProfile>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}

public class ConversationProfile
{
    public Guid ConversationId { get; set; }
    public Conversation? Conversation { get; set; }
    public Guid ProfileId { get; set; }
}
