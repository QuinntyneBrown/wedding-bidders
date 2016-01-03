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
        }

        public ConversationDto(Conversation conversation)
        {
            this.ConversationType = conversation.ConversationType;
            this.Messages = conversation.Messages.Select(x => new MessageDto(x)).ToList();
        }

        public ICollection<MessageDto> Messages { get; set; }

        public ConversationType ConversationType { get; set; }
    }
}