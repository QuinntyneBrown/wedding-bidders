using System;
using System.Collections.Generic;

namespace WeddingBidders.Server.Dtos
{
    public class WeddingDto
    {
        public WeddingDto()
        {
            this.Id = 0;
            this.Bids = new HashSet<BidDto>();
            this.Categories = new HashSet<CategoryDto>();
        }

        public int Id { get; set; }

        public int NumberOfGuests { get; set; }

        public int NumberOfHours { get; set; }

        public string Location { get; set; }

        public DateTime Date { get; set; }

        public ICollection<CategoryDto> Categories { get; set; }

        public ICollection<BidDto> Bids { get; set; }
        
    }
}