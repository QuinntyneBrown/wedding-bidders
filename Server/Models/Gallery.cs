using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WeddingBidders.Server.Models
{
    public class Gallery: BaseEntity
    {
        public Gallery()
        {
            this.Photos = new HashSet<Photo>();
        }

        public string Name { get; set; }

        public ICollection<Photo> Photos { get; set; }
    }
}