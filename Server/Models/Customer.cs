using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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

        public string Email { get; set; }

        [ForeignKey("Profile")]
        public int? ProfileId { get; set; }

        public ICollection<Wedding> Weddings { get; set; }

        public Profile Profile { get; set; }
    }
}