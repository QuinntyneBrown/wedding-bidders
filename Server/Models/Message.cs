using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingBidders.Server.Models
{
    public class Message: BaseEntity
    {
        public Message() { }

        [ForeignKey("Conversation")]
        public int? ConversationId { get; set; }
        public int? ToProfileId { get; set; }
        public int? FromProfileId { get; set; }        
        public string Subject { get; set; }
        public string Content { get; set; }        
        public bool IsRead { get; set; }
        public Conversation Conversation { get; set; }
    }
}