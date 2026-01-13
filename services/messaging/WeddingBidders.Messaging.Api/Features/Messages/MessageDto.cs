using WeddingBidders.Messaging.Core.Model;

namespace WeddingBidders.Messaging.Api.Features.Messages;

public class MessageDto
{
    public Guid MessageId { get; set; }
    public Guid ConversationId { get; set; }
    public Guid FromProfileId { get; set; }
    public Guid ToProfileId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class ConversationDto
{
    public Guid ConversationId { get; set; }
    public List<Guid> ProfileIds { get; set; } = new();
    public List<MessageDto> Messages { get; set; } = new();
}

public static class MessageExtensions
{
    public static MessageDto ToDto(this Message message)
    {
        return new MessageDto
        {
            MessageId = message.MessageId,
            ConversationId = message.ConversationId,
            FromProfileId = message.FromProfileId,
            ToProfileId = message.ToProfileId,
            Content = message.Content,
            Subject = message.Subject,
            IsRead = message.IsRead,
            CreatedDate = message.CreatedDate
        };
    }

    public static ConversationDto ToDto(this Conversation conversation)
    {
        return new ConversationDto
        {
            ConversationId = conversation.ConversationId,
            ProfileIds = conversation.Profiles.Select(p => p.ProfileId).ToList(),
            Messages = conversation.Messages.Select(m => m.ToDto()).ToList()
        };
    }
}
