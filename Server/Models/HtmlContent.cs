using System;

namespace WeddingBidders.Server.Models
{
    public class HtmlContent: BaseEntity
    {
        public string Content { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpirtyDate { get; set; }
    }
}