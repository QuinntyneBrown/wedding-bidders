using System;
using System.Collections.Generic;
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

        public int Name { get; set; }

        public ICollection<Gallery> Galleries { get; set; }
    }
}