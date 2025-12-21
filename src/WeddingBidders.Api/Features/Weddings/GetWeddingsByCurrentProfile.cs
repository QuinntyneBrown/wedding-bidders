using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.ProfileAggregate.Enums;

namespace WeddingBidders.Api.Features.Weddings;

public class GetWeddingsByCurrentProfileRequest : IRequest<GetWeddingsByCurrentProfileResponse>
{
}

public class GetWeddingsByCurrentProfileResponse
{
    public List<WeddingDto> Weddings { get; set; } = new();
}

public class GetWeddingsByCurrentProfileHandler : IRequestHandler<GetWeddingsByCurrentProfileRequest, GetWeddingsByCurrentProfileResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetWeddingsByCurrentProfileHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetWeddingsByCurrentProfileResponse> Handle(GetWeddingsByCurrentProfileRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return new GetWeddingsByCurrentProfileResponse();
        }

        var user = await _context.Users
            .Include(u => u.Profiles)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower(), cancellationToken);

        if (user == null)
        {
            return new GetWeddingsByCurrentProfileResponse();
        }

        var profile = user.Profiles.FirstOrDefault();
        if (profile == null)
        {
            return new GetWeddingsByCurrentProfileResponse();
        }

        var weddings = new List<WeddingDto>();

        if (profile.ProfileType == ProfileType.Customer)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == username.ToLower(), cancellationToken);

            if (customer != null)
            {
                var customerWeddings = await _context.Weddings
                    .Include(w => w.Categories)
                    .Where(w => w.CustomerId == customer.CustomerId)
                    .ToListAsync(cancellationToken);

                weddings = customerWeddings.Select(w => w.ToDto()).ToList();
            }
        }
        else
        {
            var bidder = await _context.Bidders
                .FirstOrDefaultAsync(b => b.Email.ToLower() == username.ToLower(), cancellationToken);

            if (bidder != null)
            {
                var bidderTypeName = bidder.BidderType.ToString().ToLower();

                var allWeddings = await _context.Weddings
                    .Include(w => w.Categories)
                    .ToListAsync(cancellationToken);

                foreach (var wedding in allWeddings)
                {
                    foreach (var category in wedding.Categories)
                    {
                        if (category.Name.Replace(" ", "").ToLower() == bidderTypeName)
                        {
                            weddings.Add(wedding.ToDto());
                            break;
                        }
                    }
                }
            }
        }

        return new GetWeddingsByCurrentProfileResponse { Weddings = weddings };
    }
}
