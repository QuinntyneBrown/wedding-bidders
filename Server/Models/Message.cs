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

        public DateTime CreatedDateTime { get; set; }

        public string Content { get; set; }

        public bool Read { get; set; }
    }
}