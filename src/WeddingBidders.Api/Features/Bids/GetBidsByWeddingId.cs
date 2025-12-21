using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Bids;

public class GetBidsByWeddingIdRequest : IRequest<GetBidsByWeddingIdResponse>
{
    public Guid WeddingId { get; set; }
}

public class GetBidsByWeddingIdResponse
{
    public List<BidDto> Bids { get; set; } = new();
}

public class GetBidsByWeddingIdHandler : IRequestHandler<GetBidsByWeddingIdRequest, GetBidsByWeddingIdResponse>
{
    private readonly IWeddingBiddersContext _context;

    public GetBidsByWeddingIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<GetBidsByWeddingIdResponse> Handle(GetBidsByWeddingIdRequest request, CancellationToken cancellationToken)
    {
        var bids = await _context.Bids
            .Where(b => b.WeddingId == request.WeddingId)
            .ToListAsync(cancellationToken);

        return new GetBidsByWeddingIdResponse
        {
            Bids = bids.Select(b => b.ToDto()).ToList()
        };
    }
}
