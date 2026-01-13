using WeddingBidders.Support.Core.Model;

namespace WeddingBidders.Support.Api.Features.Issues;

public class IssueDto
{
    public Guid IssueId { get; set; }
    public Guid ReportedByProfileId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Resolution { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ResolvedDate { get; set; }
}

public static class IssueExtensions
{
    public static IssueDto ToDto(this Issue issue)
    {
        return new IssueDto
        {
            IssueId = issue.IssueId,
            ReportedByProfileId = issue.ReportedByProfileId,
            Subject = issue.Subject,
            Content = issue.Content,
            Status = issue.Status.ToString(),
            Resolution = issue.Resolution,
            CreatedDate = issue.CreatedDate,
            ResolvedDate = issue.ResolvedDate
        };
    }
}
