namespace WeddingBidders.Server.Dtos
{
    public class SendMessageRequestDto
    {
        public SendMessageRequestDto() { }

        public string Content { get; set; }

        public int OtherProfileId { get; set; }
    }
}