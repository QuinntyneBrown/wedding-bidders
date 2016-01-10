using System.Collections.Generic;

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