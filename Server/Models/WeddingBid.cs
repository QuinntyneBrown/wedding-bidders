using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Models
{
    public class WeddingBid: BaseEntity
    {
        public WeddingBid()
        {

        }

        public int? CustomerId { get; set; }

        public int? CatererId { get; set; }

        public int? WeddingId { get; set; }

        public Customer Customer { get; set; }

        public Caterer Caterer { get; set; }

        public Wedding Wedding { get; set; }
    }
}