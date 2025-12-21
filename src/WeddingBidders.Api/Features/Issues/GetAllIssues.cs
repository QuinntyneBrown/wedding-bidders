using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Issues;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Issue)]
public class GetAllIssuesRequest : IRequest<GetAllIssuesResponse>
{
}

public class GetAllIssuesResponse
{
    public List<IssueDto> Issues { get; set; } = new();
}

public class GetAllIssuesHandler : IRequestHandler<GetAllIssuesRequest, GetAllIssuesResponse>
{
    private readonly IWeddingBiddersContext _context;

    public GetAllIssuesHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<GetAllIssuesResponse> Handle(GetAllIssuesRequest request, CancellationToken cancellationToken)
    {
        var issues = await _context.Issues
            .ToListAsync(cancellationToken);

        return new GetAllIssuesResponse
        {
            Issues = issues.Select(i => i.ToDto()).ToList()
        };
    }
}
