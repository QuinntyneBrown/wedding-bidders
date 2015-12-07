using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingBidders.Server.Models
{
    public class Bid: BaseEntity
    {
        public Bid()
        {

        }

        [ForeignKey("Wedding")]
        public int? WeddingId { get; set; }

        [ForeignKey("Bidder")]
        public int? BidderId { get; set; }

        public string Description { get; set; }

        public float Price { get; set; }
        
        public Bidder Bidder { get; set; }

        public Wedding Wedding { get; set; }
    }
}