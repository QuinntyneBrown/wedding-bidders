namespace WeddingBidders.Server.Models
{
    public class BidderDescription: BaseEntity {

        public BidderDescription() { }

        public string Content { get; set; }
        public BidderType BidderType { get; set; }
    }   
}