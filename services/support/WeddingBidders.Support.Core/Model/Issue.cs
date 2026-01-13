using WeddingBidders.Shared.Core;

namespace WeddingBidders.Support.Core.Model;

public class Issue : BaseEntity
{
    public Guid IssueId { get; set; }
    public Guid ReportedByProfileId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public IssueStatus Status { get; set; }
    public string? Resolution { get; set; }
    public DateTime? ResolvedDate { get; set; }
}

public enum IssueStatus
{
    Open = 0,
    InProgress = 1,
    Resolved = 2,
    Closed = 3
}
