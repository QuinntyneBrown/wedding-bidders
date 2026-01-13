using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Bidding.Core;

namespace WeddingBidders.Bidding.Api.Features.Bidders;

public class GetAllBiddersRequest : IRequest<List<BidderDto>>
{
}

public class GetAllBiddersHandler : IRequestHandler<GetAllBiddersRequest, List<BidderDto>>
{
    private readonly IBiddingContext _context;

    public GetAllBiddersHandler(IBiddingContext context)
    {
        _context = context;
    }

    public async Task<List<BidderDto>> Handle(GetAllBiddersRequest request, CancellationToken cancellationToken)
    {
        var bidders = await _context.Bidders
            .Include(b => b.Galleries)
            .Where(b => b.IsApproved)
            .OrderByDescending(b => b.CreatedDate)
            .ToListAsync(cancellationToken);

        return bidders.Select(b => b.ToDto()).ToList();
    }
}
