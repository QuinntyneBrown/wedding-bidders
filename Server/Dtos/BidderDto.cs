using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class BidderDto
    {
        public BidderDto()
        {

        }

        public BidderDto(Bidder bidder)
        {
            this.Id = bidder.Id;
            this.Firstname = bidder.Firstname;
            this.Lastname = bidder.Lastname;
            this.Email = bidder.Email;
            this.BidderType = bidder.BidderType;
        }

        public int? Id { get; set; }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }

        public BidderType BidderType { get; set; }
    }

}