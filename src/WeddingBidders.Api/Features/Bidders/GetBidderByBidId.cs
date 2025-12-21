using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Bidders;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Bidder)]
public class GetBidderByBidIdRequest : IRequest<BidderDto?>
{
    public Guid BidId { get; set; }
}

public class GetBidderByBidIdHandler : IRequestHandler<GetBidderByBidIdRequest, BidderDto?>
{
    private readonly IWeddingBiddersContext _context;

    public GetBidderByBidIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<BidderDto?> Handle(GetBidderByBidIdRequest request, CancellationToken cancellationToken)
    {
        var bidder = await _context.Bidders
            .Include(b => b.Bids)
            .Where(b => b.Bids.Any(bid => bid.BidId == request.BidId))
            .FirstOrDefaultAsync(cancellationToken);

        return bidder?.ToDto();
    }
}
