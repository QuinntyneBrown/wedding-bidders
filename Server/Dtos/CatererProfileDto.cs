using System.Collections.Generic;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class CatererProfileDto: ProfileDto
    {
        public CatererProfileDto()
        {
            this.Bids = new HashSet<BidDto>();
        }

        public ICollection<BidDto> Bids { get; set; }

        public ProfileType ProfileType {  get { return ProfileType.Caterer;  } }
    }
}