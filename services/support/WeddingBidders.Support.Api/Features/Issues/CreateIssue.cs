using FluentValidation;
using MediatR;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;
using WeddingBidders.Support.Core;
using WeddingBidders.Support.Core.Model;

namespace WeddingBidders.Support.Api.Features.Issues;

public class CreateIssueRequest : IRequest<IssueDto>
{
    public Guid ReportedByProfileId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class CreateIssueRequestValidator : AbstractValidator<CreateIssueRequest>
{
    public CreateIssueRequestValidator()
    {
        RuleFor(x => x.ReportedByProfileId).NotEmpty();
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Content).NotEmpty();
    }
}

public class CreateIssueHandler : IRequestHandler<CreateIssueRequest, IssueDto>
{
    private readonly ISupportContext _context;
    private readonly IEventBus _eventBus;

    public CreateIssueHandler(ISupportContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<IssueDto> Handle(CreateIssueRequest request, CancellationToken cancellationToken)
    {
        var issue = new Issue
        {
            IssueId = Guid.NewGuid(),
            ReportedByProfileId = request.ReportedByProfileId,
            Subject = request.Subject,
            Content = request.Content,
            Status = IssueStatus.Open,
            CreatedDate = DateTime.UtcNow
        };

        _context.Issues.Add(issue);
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new IssueCreatedEvent
        {
            IssueId = issue.IssueId,
            ReportedByProfileId = issue.ReportedByProfileId,
            Subject = issue.Subject,
            Content = issue.Content
        }, cancellationToken);

        return issue.ToDto();
    }
}
