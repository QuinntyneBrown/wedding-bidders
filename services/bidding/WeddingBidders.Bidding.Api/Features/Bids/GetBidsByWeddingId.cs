using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Bidding.Core;

namespace WeddingBidders.Bidding.Api.Features.Bids;

public class GetBidsByWeddingIdRequest : IRequest<List<BidDto>>
{
    public Guid WeddingId { get; set; }
}

public class GetBidsByWeddingIdHandler : IRequestHandler<GetBidsByWeddingIdRequest, List<BidDto>>
{
    private readonly IBiddingContext _context;

    public GetBidsByWeddingIdHandler(IBiddingContext context)
    {
        _context = context;
    }

    public async Task<List<BidDto>> Handle(GetBidsByWeddingIdRequest request, CancellationToken cancellationToken)
    {
        var bids = await _context.Bids
            .Where(b => b.WeddingId == request.WeddingId)
            .OrderByDescending(b => b.CreatedDate)
            .ToListAsync(cancellationToken);

        return bids.Select(b => b.ToDto()).ToList();
    }
}
