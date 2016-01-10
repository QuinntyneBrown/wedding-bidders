using System.Collections.Generic;
using System.Linq;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class ConversationDto
    {
        public ConversationDto()
        {
            this.Messages = new HashSet<MessageDto>();
            this.Profiles = new HashSet<ProfileDto>();
        }

        public ConversationDto(Conversation conversation)
        {
            this.Messages = conversation.Messages.Select(x => new MessageDto(x)).ToList();
            this.Profiles = conversation.Profiles.Select(x => new ProfileDto(x)).ToList();
        }

        public ICollection<MessageDto> Messages { get; set; }
        public ICollection<ProfileDto> Profiles { get; set; }
    }
}