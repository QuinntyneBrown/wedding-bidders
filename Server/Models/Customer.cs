using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingBidders.Server.Models
{
    public class Customer: Person
    {
        public Customer()
        {
            this.Weddings = new HashSet<Wedding>();
        }

        [ForeignKey("Profile")]
        public int? ProfileId { get; set; }

        public ICollection<Wedding> Weddings { get; set; }

        public Profile Profile { get; set; }
    }
}