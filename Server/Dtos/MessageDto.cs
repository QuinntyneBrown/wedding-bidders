using System;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class MessageDto
    {
        public MessageDto()
        {

        }

        public MessageDto(Message message)
        {

        }

        public int? Id { get; set; }

        public string Subject { get; set; }

        public string Content { get; set; }

        public int? FromProfileId { get; set; }

        public int? ToProfileId { get; set; }

        public bool IsRead { get; set; }

        public DateTime? CreatedDate { get; set; }

        public MessageType MessageType { get; set; }
        
    }
}