using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Bidders;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Bidder)]
public class GetBidderByIdRequest : IRequest<BidderDto?>
{
    public Guid BidderId { get; set; }
}

public class GetBidderByIdHandler : IRequestHandler<GetBidderByIdRequest, BidderDto?>
{
    private readonly IWeddingBiddersContext _context;

    public GetBidderByIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<BidderDto?> Handle(GetBidderByIdRequest request, CancellationToken cancellationToken)
    {
        var bidder = await _context.Bidders
            .FirstOrDefaultAsync(b => b.BidderId == request.BidderId, cancellationToken);

        return bidder?.ToDto();
    }
}
