using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class BidDto
    {
        public BidDto()
        {

        }

        public BidDto(Bid bid)
        {
            this.Id = bid.Id;
            this.Price = bid.Price;
            this.Description = bid.Description;
            this.WeddingId = bid.WeddingId;
            this.BidderId = bid.BidderId;
        }

        public int Id { get; set; }

        public float Price { get; set; }

        public string Description { get; set; }

        public int? WeddingId { get; set; }

        public int? BidderId { get; set; }
    }
}