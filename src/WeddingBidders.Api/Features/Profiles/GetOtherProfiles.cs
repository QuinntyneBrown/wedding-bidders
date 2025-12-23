using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.ProfileAggregate.Enums;

namespace WeddingBidders.Api.Features.Profiles;

public class GetOtherProfilesRequest : IRequest<List<ProfileDto>>
{
}

public class GetOtherProfilesHandler : IRequestHandler<GetOtherProfilesRequest, List<ProfileDto>>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetOtherProfilesHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<ProfileDto>> Handle(GetOtherProfilesRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return new List<ProfileDto>();
        }

        var currentProfile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

        if (currentProfile == null)
        {
            return new List<ProfileDto>();
        }

        var results = new List<ProfileDto>();

        if (currentProfile.ProfileType == ProfileType.Customer)
        {
            // For customers: get bidders who bid on their weddings
            var customer = await _context.Customers
                .Include(c => c.Weddings)
                .ThenInclude(w => w.Bids)
                .ThenInclude(b => b.Bidder)
                .ThenInclude(bidder => bidder!.Profile)
                .ThenInclude(p => p!.Account)
                .FirstOrDefaultAsync(c => c.ProfileId == currentProfile.ProfileId, cancellationToken);

            if (customer?.Weddings != null)
            {
                var bidderProfiles = customer.Weddings
                    .Where(w => !w.IsDeleted)
                    .SelectMany(w => w.Bids)
                    .Where(b => b.Bidder?.Profile != null)
                    .Select(b => b.Bidder!.Profile!)
                    .DistinctBy(p => p.ProfileId)
                    .ToList();

                results = bidderProfiles.Select(p => p.ToDto()).ToList();
            }
        }
        else
        {
            // For bidders: get customers whose weddings they bid on
            var bidder = await _context.Bidders
                .Include(b => b.Bids)
                .ThenInclude(bid => bid.Wedding)
                .ThenInclude(w => w!.Customer)
                .ThenInclude(c => c!.Profile)
                .ThenInclude(p => p!.Account)
                .FirstOrDefaultAsync(b => b.ProfileId == currentProfile.ProfileId, cancellationToken);

            if (bidder?.Bids != null)
            {
                var customerProfiles = bidder.Bids
                    .Where(b => b.Wedding != null && !b.Wedding.IsDeleted && b.Wedding.Customer?.Profile != null)
                    .Select(b => b.Wedding!.Customer!.Profile!)
                    .DistinctBy(p => p.ProfileId)
                    .ToList();

                results = customerProfiles.Select(p => p.ToDto()).ToList();
            }
        }

        return results;
    }
}
