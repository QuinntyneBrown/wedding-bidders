using System.Collections.Generic;

namespace WeddingBidders.Server.Models
{
    public class Page: BaseEntity
    {
        public Page()
        {
            this.HtmlContentCollection = new HashSet<HtmlContent>();
        }

        public string Route { get; set; }

        public ICollection<HtmlContent> HtmlContentCollection { get; set; }
    }
}