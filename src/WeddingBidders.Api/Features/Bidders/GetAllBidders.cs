using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Bidders;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Bidder)]
public class GetAllBiddersRequest : IRequest<GetAllBiddersResponse>
{
}

public class GetAllBiddersResponse
{
    public List<BidderDto> Bidders { get; set; } = new();
}

public class GetAllBiddersHandler : IRequestHandler<GetAllBiddersRequest, GetAllBiddersResponse>
{
    private readonly IWeddingBiddersContext _context;

    public GetAllBiddersHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<GetAllBiddersResponse> Handle(GetAllBiddersRequest request, CancellationToken cancellationToken)
    {
        var bidders = await _context.Bidders
            .ToListAsync(cancellationToken);

        return new GetAllBiddersResponse
        {
            Bidders = bidders.Select(b => b.ToDto()).ToList()
        };
    }
}
