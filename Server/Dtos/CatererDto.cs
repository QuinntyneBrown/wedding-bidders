using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class CatererDto
    {
        public CatererDto()
        {
            this.Galleries = new HashSet<GalleryDto>();
        }

        public int? Id { get; set; }

        public string CompanyName { get; set; }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }

        public string Description { get; set; }

        public ICollection<GalleryDto> Galleries { get; set; }

        public ProfileType ProfileType { get { return ProfileType.Caterer; } }
    }
}