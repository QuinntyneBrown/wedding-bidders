using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Dtos
{
    public class MessageDto
    {
        public int? Id { get; set; }

        public string Description { get; set; }

        public int? FromProfileId { get; set; }

        public int? ToProfileId { get; set; }
    }
}