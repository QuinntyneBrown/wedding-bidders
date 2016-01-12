using System;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class MessageDto
    {
        public MessageDto() { }

        public MessageDto(Message message)
        {
            this.Id = message.Id;
            this.FromProfileId = message.FromProfileId;
            this.ToProfileId = message.ToProfileId;
            this.Subject = message.Subject;
            this.Content = message.Content;
            this.IsRead = message.IsRead;
            this.CreatedDate = TimeZoneInfo.ConvertTimeFromUtc(message.CreatedDate.Value, TimeZoneInfo.FindSystemTimeZoneById("Eastern Standard Time"));          
            this.ConversationId = message.ConversationId;
        }

        public int? Id { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public int? FromProfileId { get; set; }
        public int? ToProfileId { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? ConversationId { get; set; }
    }
}