namespace WeddingBidders.Core.Model.MessageAggregate;

public class Message
{
    public Guid MessageId { get; set; }
    public Guid? ConversationId { get; set; }
    public Guid? ToProfileId { get; set; }
    public Guid? FromProfileId { get; set; }
    public string? Subject { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public Conversation? Conversation { get; set; }
}
