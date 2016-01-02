using System.Collections.Generic;

namespace WeddingBidders.Server.Models
{
    public class Conversation: BaseEntity
    {
        public Conversation()
        {
            this.Messages = new HashSet<Message>();
            this.ConversationType = ConversationType.InterProfile;
        }

        public ICollection<Message> Messages { get; set; }

        public ConversationType ConversationType { get; set; }
    }
}