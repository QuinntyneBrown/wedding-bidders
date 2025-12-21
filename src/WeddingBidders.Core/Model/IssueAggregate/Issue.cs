using WeddingBidders.Core.Model.IssueAggregate.Enums;
using WeddingBidders.Core.Model.ProfileAggregate;

namespace WeddingBidders.Core.Model.IssueAggregate;

public class Issue
{
    public Guid IssueId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public IssueStatus IssueStatus { get; set; }
    public Guid ReportedById { get; set; }
    public Profile? ReportedBy { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
}
