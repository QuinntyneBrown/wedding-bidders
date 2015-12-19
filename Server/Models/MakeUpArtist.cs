using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Models
{
    public class MakeUpArtist: Bidder
    {
        public MakeUpArtist()
        {
            this.BidderType = BidderType.MakeUpArtist;
        }

    }
}