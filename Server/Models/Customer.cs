using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Models
{
    public class Customer: BaseEntity
    {
        public Customer()
        {
            this.Weddings = new HashSet<Wedding>();
        }

        public ICollection<Wedding> Weddings { get; set; }

    }
}