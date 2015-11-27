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

        [ForeignKey("User")]
        public int? UserId { get; set; }

        public ICollection<Wedding> Weddings { get; set; }

        public User User { get; set; }
    }
}