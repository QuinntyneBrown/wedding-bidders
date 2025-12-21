using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Bids;

public class GetBidsByBidderIdRequest : IRequest<GetBidsByBidderIdResponse>
{
    public Guid BidderId { get; set; }
}

public class GetBidsByBidderIdResponse
{
    public List<BidDto> Bids { get; set; } = new();
}

public class GetBidsByBidderIdHandler : IRequestHandler<GetBidsByBidderIdRequest, GetBidsByBidderIdResponse>
{
    private readonly IWeddingBiddersContext _context;

    public GetBidsByBidderIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<GetBidsByBidderIdResponse> Handle(GetBidsByBidderIdRequest request, CancellationToken cancellationToken)
    {
        var bids = await _context.Bids
            .Where(b => b.BidderId == request.BidderId)
            .ToListAsync(cancellationToken);

        return new GetBidsByBidderIdResponse
        {
            Bids = bids.Select(b => b.ToDto()).ToList()
        };
    }
}
