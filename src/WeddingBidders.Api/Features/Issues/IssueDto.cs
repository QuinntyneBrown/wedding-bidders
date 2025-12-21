using WeddingBidders.Core.Model.IssueAggregate;
using WeddingBidders.Core.Model.IssueAggregate.Enums;

namespace WeddingBidders.Api.Features.Issues;

public class IssueDto
{
    public Guid IssueId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public IssueStatus IssueStatus { get; set; }
    public Guid ReportedById { get; set; }
    public DateTime CreatedDate { get; set; }
}

public static class IssueExtensions
{
    public static IssueDto ToDto(this Issue issue)
    {
        return new IssueDto
        {
            IssueId = issue.IssueId,
            Subject = issue.Subject,
            Content = issue.Content,
            IssueStatus = issue.IssueStatus,
            ReportedById = issue.ReportedById,
            CreatedDate = issue.CreatedDate
        };
    }
}
