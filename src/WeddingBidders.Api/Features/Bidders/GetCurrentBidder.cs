using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Bidders;

public class GetCurrentBidderRequest : IRequest<BidderDto?>
{
}

public class GetCurrentBidderHandler : IRequestHandler<GetCurrentBidderRequest, BidderDto?>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentBidderHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<BidderDto?> Handle(GetCurrentBidderRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return null;
        }

        var bidder = await _context.Bidders
            .FirstOrDefaultAsync(b => b.Email.ToLower() == username.ToLower(), cancellationToken);

        return bidder?.ToDto();
    }
}
