using System.Collections.Generic;

namespace WeddingBidders.Server.Models
{
    public class Conversation: BaseEntity
    {
        public Conversation()
        {
            this.Messages = new HashSet<Message>();
            this.Profiles = new HashSet<Profile>();
        }

        public ICollection<Profile> Profiles { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}