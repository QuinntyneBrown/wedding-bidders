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
        }

        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }

        public User User { get; set; }

        public ICollection<Gallery> Galleries { get; set; }
    }
}