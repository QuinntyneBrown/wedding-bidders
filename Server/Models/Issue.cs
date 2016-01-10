using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingBidders.Server.Models
{
    public class Issue: BaseEntity
    {
        public Issue() { }

        public string Subject { get; set; }
        public string Content { get; set; }
        public IssueStatus IssueStatus { get; set; }
        [ForeignKey("ReportedBy")]
        public int ReportedById { get; set; }
        public Profile ReportedBy { get; set; }
    }
}