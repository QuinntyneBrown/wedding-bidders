using WeddingBidders.Core.Model.MessageAggregate;

namespace WeddingBidders.Api.Features.Messages;

public class MessageDto
{
    public Guid MessageId { get; set; }
    public Guid? ConversationId { get; set; }
    public Guid? ToProfileId { get; set; }
    public Guid? FromProfileId { get; set; }
    public string? Subject { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class ConversationDto
{
    public Guid ConversationId { get; set; }
    public List<MessageDto> Messages { get; set; } = new();
    public List<ProfileSummaryDto> Profiles { get; set; } = new();
}

public class ProfileSummaryDto
{
    public Guid ProfileId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
}

public static class MessageExtensions
{
    public static MessageDto ToDto(this Message message)
    {
        return new MessageDto
        {
            MessageId = message.MessageId,
            ConversationId = message.ConversationId,
            ToProfileId = message.ToProfileId,
            FromProfileId = message.FromProfileId,
            Subject = message.Subject,
            Content = message.Content,
            IsRead = message.IsRead,
            CreatedDate = message.CreatedDate
        };
    }
}
