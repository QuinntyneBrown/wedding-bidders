using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class IssueDto
    {
        public IssueDto() { }

        public IssueDto(Issue issue)
        {
            this.Id = issue.Id;
            this.ReportedByProfileId = issue.ReportedById;
            this.Subject = issue.Subject;
            this.Content = issue.Content;
            this.IssueStatus = issue.IssueStatus;
        }

        public int Id { get; set; }
        public int ReportedByProfileId { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public IssueStatus IssueStatus { get; set; }
    }
}