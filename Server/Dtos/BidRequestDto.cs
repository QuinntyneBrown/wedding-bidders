using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Dtos
{
    public class BidRequestDto
    {
        public int WeddingId { get; set; }

        public int CatererId { get; set; }

        public float Price { get; set; }

        public string Description { get; set; }                
    }
}