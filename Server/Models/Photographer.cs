using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Models
{
    public class Photographer: Bidder
    {
        public Photographer()
        {
            this.BidderType = BidderType.Photographer;
        }

    }
}