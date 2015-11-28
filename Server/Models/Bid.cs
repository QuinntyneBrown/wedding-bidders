using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Models
{
    public class Bid: BaseEntity
    {
        public Bid()
        {

        }

        public int? CatererId { get; set; }

        public int? WeddingId { get; set; }

        public string Description { get; set; }

        public float Price { get; set; }
        
        public Caterer Caterer { get; set; }

        public Wedding Wedding { get; set; }
    }
}