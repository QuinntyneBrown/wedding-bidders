using WeddingBidders.Shared.Core;

namespace WeddingBidders.Messaging.Core.Model;

public class Message : BaseEntity
{
    public Guid MessageId { get; set; }
    public Guid ConversationId { get; set; }
    public Conversation? Conversation { get; set; }
    public Guid FromProfileId { get; set; }
    public Guid ToProfileId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public bool IsRead { get; set; }
}
