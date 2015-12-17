using System;
using System.Collections.Generic;

namespace WeddingBidders.Server.Models
{
    public class Wedding: BaseEntity
    {
        public Wedding()
        {
            this.Bids = new HashSet<Bid>();
            this.Categories = new HashSet<string>();
        }

        public int NumberOfGuests { get; set; }

        public int NumberOfHours { get; set; }

        public string Location { get; set; }

        public ICollection<Bid> Bids { get; set; }

        public int? CustomerId { get; set; }

        public Customer Customer { get; set; }

        public DateTime Date { get; set; }

        public ICollection<string> Categories { get; set; }
    }
}