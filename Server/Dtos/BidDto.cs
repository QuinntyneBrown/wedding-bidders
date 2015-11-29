using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Dtos
{
    public class BidDto
    {
        public BidDto()
        {

        }

        public int Id { get; set; }

        public float Price { get; set; }

        public string Description { get; set; }

        public int? WeddingId { get; set; }
    }
}