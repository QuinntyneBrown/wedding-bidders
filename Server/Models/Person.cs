using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Models
{
    public class Person: BaseEntity
    {
        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }
    }
}