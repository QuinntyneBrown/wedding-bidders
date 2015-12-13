using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingBidders.Server.Models
{
    public class Caterer: Bidder
    {
        public Caterer()
        {
            this.BidderType = BidderType.Caterer;
        }

        public string CompanyName { get; set; }
        
    }
}