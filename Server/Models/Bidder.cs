using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingBidders.Server.Models
{
    public class Bidder: Person
    {
        public Bidder()
        {
            this.Galleries = new HashSet<Gallery>();
            this.Bids = new HashSet<Bid>();
        }

        public string Description { get; set; }

        [ForeignKey("Profile")]
        public int? ProfileId { get; set; }

        public Profile Profile { get; set; }

        public ICollection<Gallery> Galleries { get; set; }

        public ICollection<Bid> Bids { get; set; }

        public bool IsApproved { get; set; }
    }
}