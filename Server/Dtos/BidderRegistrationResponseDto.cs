using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Dtos
{
    public class BidderRegistrationResponseDto
    {
        public BidderRegistrationResponseDto()
        {

        }

        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
    }
}