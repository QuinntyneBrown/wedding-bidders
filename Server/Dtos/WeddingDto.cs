using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Dtos
{
    public class WeddingDto
    {
        public WeddingDto()
        {
            this.Id = 0;
        }

        public int Id { get; set; }
        public int NumberOfGuests { get; set; }
    }
}