using System.Collections.Generic;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class CustomerProfileDto : ProfileDto
    {
        public CustomerProfileDto()
        {
            this.Weddings = new HashSet<WeddingDto>();
        }

        public ICollection<WeddingDto> Weddings { get; set; }

        public ProfileType ProfileType { get { return ProfileType.Customer; } }
    }
}