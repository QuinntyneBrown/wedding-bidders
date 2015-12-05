using System.Collections.Generic;

namespace WeddingBidders.Server.Dtos
{
    public class GalleryDto
    {
        public GalleryDto()
        {
            this.PictureUrls = new HashSet<string>();
        }

        public string Name { get; set; }

        public ICollection<string> PictureUrls { get; set; }
    }
}