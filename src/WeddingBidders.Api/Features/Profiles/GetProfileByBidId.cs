using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Profiles;

public class GetProfileByBidIdRequest : IRequest<ProfileDto?>
{
    public Guid BidId { get; set; }
}

public class GetProfileByBidIdHandler : IRequestHandler<GetProfileByBidIdRequest, ProfileDto?>
{
    private readonly IWeddingBiddersContext _context;

    public GetProfileByBidIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<ProfileDto?> Handle(GetProfileByBidIdRequest request, CancellationToken cancellationToken)
    {
        var bidder = await _context.Bidders
            .Include(b => b.Bids)
            .Include(b => b.Profile)
            .ThenInclude(p => p!.Account)
            .FirstOrDefaultAsync(b => b.Bids.Any(bid => bid.BidId == request.BidId), cancellationToken);

        return bidder?.Profile?.ToDto();
    }
}
