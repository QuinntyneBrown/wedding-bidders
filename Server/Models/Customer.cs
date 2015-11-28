using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
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

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        [ForeignKey("Profile")]
        public int? ProfileId { get; set; }

        public ICollection<Wedding> Weddings { get; set; }

        public Profile Profile { get; set; }
    }
}