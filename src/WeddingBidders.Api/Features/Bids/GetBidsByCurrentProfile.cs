using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.ProfileAggregate.Enums;

namespace WeddingBidders.Api.Features.Bids;

public class GetBidsByCurrentProfileRequest : IRequest<GetBidsByCurrentProfileResponse>
{
}

public class GetBidsByCurrentProfileResponse
{
    public List<BidDto> Bids { get; set; } = new();
}

public class GetBidsByCurrentProfileHandler : IRequestHandler<GetBidsByCurrentProfileRequest, GetBidsByCurrentProfileResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetBidsByCurrentProfileHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetBidsByCurrentProfileResponse> Handle(GetBidsByCurrentProfileRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return new GetBidsByCurrentProfileResponse();
        }

        var user = await _context.Users
            .Include(u => u.Profiles)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower(), cancellationToken);

        if (user == null)
        {
            return new GetBidsByCurrentProfileResponse();
        }

        var profile = user.Profiles.FirstOrDefault();
        if (profile == null)
        {
            return new GetBidsByCurrentProfileResponse();
        }

        var bids = new List<BidDto>();

        if (profile.ProfileType == ProfileType.Customer)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.ProfileId == profile.ProfileId, cancellationToken);

            if (customer != null)
            {
                var weddings = await _context.Weddings
                    .Include(w => w.Bids)
                    .Where(w => w.CustomerId == customer.CustomerId)
                    .ToListAsync(cancellationToken);

                foreach (var wedding in weddings)
                {
                    foreach (var bid in wedding.Bids)
                    {
                        bids.Add(bid.ToDto());
                    }
                }
            }
        }
        else
        {
            var bidder = await _context.Bidders
                .FirstOrDefaultAsync(b => b.Email.ToLower() == username.ToLower(), cancellationToken);

            if (bidder != null)
            {
                var bidderBids = await _context.Bids
                    .Where(b => b.BidderId == bidder.BidderId)
                    .ToListAsync(cancellationToken);

                bids = bidderBids.Select(b => b.ToDto()).ToList();
            }
        }

        return new GetBidsByCurrentProfileResponse { Bids = bids };
    }
}
