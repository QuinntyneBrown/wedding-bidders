using System;

namespace WeddingBidders.Server.Models
{
    public class Message: BaseEntity
    {
        public Message()
        {

        }

        public int? ToProfileId { get; set; }

        public int? FromProfileId { get; set; }
        
        public string Subject { get; set; }

        public string Content { get; set; }
        
        public bool IsRead { get; set; }
    }
}