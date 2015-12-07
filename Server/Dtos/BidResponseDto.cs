using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class BidResponseDto
    {
        public BidResponseDto()
        {

        }

        public BidResponseDto(Bid bid)
        {
            this.Id = bid.Id;
            this.ProfileType = ProfileType.Caterer;
            this.Description = bid.Description;
            this.Price = bid.Price;
            this.WeddingId = bid.WeddingId;
        }

        public int Id { get; set; }
        public int ProfileId { get; set; }
        public ProfileType ProfileType { get; set; }
        public int BidderId { get; set; }
        public int? WeddingId { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
    }
}