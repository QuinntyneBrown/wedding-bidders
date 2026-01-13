using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Bidding.Core;

namespace WeddingBidders.Bidding.Api.Features.Bids;

public class GetBidsByBidderIdRequest : IRequest<List<BidDto>>
{
    public Guid BidderId { get; set; }
}

public class GetBidsByBidderIdHandler : IRequestHandler<GetBidsByBidderIdRequest, List<BidDto>>
{
    private readonly IBiddingContext _context;

    public GetBidsByBidderIdHandler(IBiddingContext context)
    {
        _context = context;
    }

    public async Task<List<BidDto>> Handle(GetBidsByBidderIdRequest request, CancellationToken cancellationToken)
    {
        var bids = await _context.Bids
            .Where(b => b.BidderId == request.BidderId)
            .OrderByDescending(b => b.CreatedDate)
            .ToListAsync(cancellationToken);

        return bids.Select(b => b.ToDto()).ToList();
    }
}
