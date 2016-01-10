using System;

namespace WeddingBidders.Server.Models
{
    public class Payment: BaseEntity
    {
        public Payment() { }

        public int? AccountId { get; set; }
        public float? Amount { get; set; }
        public DateTime DateTime { get; set; }
    }
}