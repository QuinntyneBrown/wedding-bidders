using WeddingBidders.Core.Model.ProfileAggregate;

namespace WeddingBidders.Core.Model.MessageAggregate;

public class Conversation
{
    public Guid ConversationId { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public ICollection<Message> Messages { get; set; } = new List<Message>();
    public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
}
