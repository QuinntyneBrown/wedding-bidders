using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Models
{
    public class Caterer: BaseEntity
    {
        public Caterer()
        {
            this.Galleries = new HashSet<Gallery>();
            this.Bids = new HashSet<Bid>();
        }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }

        [ForeignKey("Profile")]
        public int? ProfileId { get; set; }

        public Profile Profile { get; set; }

        public ICollection<Gallery> Galleries { get; set; }

        public ICollection<Bid> Bids { get; set; }
    }
}