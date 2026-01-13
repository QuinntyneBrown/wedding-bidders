using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Bidding.Core;

namespace WeddingBidders.Bidding.Api.Features.Bidders;

public class GetBidderByIdRequest : IRequest<BidderDto?>
{
    public Guid BidderId { get; set; }
}

public class GetBidderByIdHandler : IRequestHandler<GetBidderByIdRequest, BidderDto?>
{
    private readonly IBiddingContext _context;

    public GetBidderByIdHandler(IBiddingContext context)
    {
        _context = context;
    }

    public async Task<BidderDto?> Handle(GetBidderByIdRequest request, CancellationToken cancellationToken)
    {
        var bidder = await _context.Bidders
            .Include(b => b.Galleries)
            .FirstOrDefaultAsync(b => b.BidderId == request.BidderId, cancellationToken);

        return bidder?.ToDto();
    }
}
