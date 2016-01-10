using System.Collections.Generic;

namespace WeddingBidders.Server.Models
{
    public class Plan : BaseEntity
    {
        public Plan()
        {
            this.Subscriptions = new HashSet<Subscription>();
        }

        public string Description { get; set; }
        public decimal Price { get; set; }
        public ICollection<Subscription> Subscriptions { get; set; }
    }
}