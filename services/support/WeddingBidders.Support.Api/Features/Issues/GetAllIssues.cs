using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Support.Core;

namespace WeddingBidders.Support.Api.Features.Issues;

public class GetAllIssuesRequest : IRequest<List<IssueDto>>
{
}

public class GetAllIssuesHandler : IRequestHandler<GetAllIssuesRequest, List<IssueDto>>
{
    private readonly ISupportContext _context;

    public GetAllIssuesHandler(ISupportContext context)
    {
        _context = context;
    }

    public async Task<List<IssueDto>> Handle(GetAllIssuesRequest request, CancellationToken cancellationToken)
    {
        var issues = await _context.Issues
            .OrderByDescending(i => i.CreatedDate)
            .ToListAsync(cancellationToken);

        return issues.Select(i => i.ToDto()).ToList();
    }
}
