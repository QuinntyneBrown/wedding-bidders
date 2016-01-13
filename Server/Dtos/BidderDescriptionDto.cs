using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class BidderDescriptionDto
    {
        public BidderDescriptionDto() { }

        public BidderDescriptionDto(BidderDescription bidderDescription)
        {
            this.Content = bidderDescription.Content;
            this.BidderType = bidderDescription.BidderType;
        }

        public string Content { get; set; }
        public BidderType BidderType { get; set; }
    }
}