using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Bidders;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Bidder)]
public class GetBidderByProfileIdRequest : IRequest<BidderDto?>
{
    public Guid ProfileId { get; set; }
}

public class GetBidderByProfileIdHandler : IRequestHandler<GetBidderByProfileIdRequest, BidderDto?>
{
    private readonly IWeddingBiddersContext _context;

    public GetBidderByProfileIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<BidderDto?> Handle(GetBidderByProfileIdRequest request, CancellationToken cancellationToken)
    {
        var bidder = await _context.Bidders
            .FirstOrDefaultAsync(b => b.ProfileId == request.ProfileId, cancellationToken);

        return bidder?.ToDto();
    }
}
