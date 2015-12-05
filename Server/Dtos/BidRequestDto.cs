namespace WeddingBidders.Server.Dtos
{
    public class BidRequestDto
    {
        public int WeddingId { get; set; }
        
        public float Price { get; set; }

        public string Description { get; set; }                
    }
}