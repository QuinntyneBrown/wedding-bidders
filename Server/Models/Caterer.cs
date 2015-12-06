using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingBidders.Server.Models
{
    public class Caterer: Bidder
    {
        public Caterer()
        {

        }

        public string CompanyName { get; set; }

        public string Description { get; set; }

    }
}