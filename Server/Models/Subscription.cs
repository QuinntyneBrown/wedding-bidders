using System;
using System.Collections.Generic;

namespace WeddingBidders.Server.Models
{
    public class Subscription: BaseEntity
    {
        public Subscription()
        {
            this.Payments = new HashSet<Payment>();
        }

        public int AccountId { get; set; }

        public int PlanId { get; set; }

        public DateTime EffectiveDate { get; set; }

        public DateTime ExpirtyDate { get; set; }

        public ICollection<Payment> Payments { get; set; }
    }
}