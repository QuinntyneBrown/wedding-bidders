using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Models
{
    public class EventPlanner: Bidder
    {
        public EventPlanner()
        {
            this.BidderType = BidderType.EventPlanner;
        }
    }
}