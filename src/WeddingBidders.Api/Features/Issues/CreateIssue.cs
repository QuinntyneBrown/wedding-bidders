using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.IssueAggregate;
using WeddingBidders.Core.Model.IssueAggregate.Enums;

namespace WeddingBidders.Api.Features.Issues;

public class CreateIssueRequest : IRequest<IssueDto>
{
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class CreateIssueRequestValidator : AbstractValidator<CreateIssueRequest>
{
    public CreateIssueRequestValidator()
    {
        RuleFor(x => x.Subject).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Content).NotEmpty().MaximumLength(4000);
    }
}

public class CreateIssueHandler : IRequestHandler<CreateIssueRequest, IssueDto>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateIssueHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<IssueDto> Handle(CreateIssueRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }

        var user = await _context.Users
            .Include(u => u.Profiles)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower(), cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var profile = user.Profiles.FirstOrDefault();
        if (profile == null)
        {
            throw new InvalidOperationException("Profile not found");
        }

        var issue = new Issue
        {
            IssueId = Guid.NewGuid(),
            Subject = request.Subject,
            Content = request.Content,
            IssueStatus = IssueStatus.New,
            ReportedById = profile.ProfileId,
            CreatedDate = DateTime.UtcNow
        };

        _context.Issues.Add(issue);
        await _context.SaveChangesAsync(cancellationToken);

        return issue.ToDto();
    }
}
