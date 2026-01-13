using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;

namespace WeddingBidders.Identity.Api.Features.Profiles;

public class GetCurrentProfileRequest : IRequest<ProfileDto?>
{
}

public class GetCurrentProfileHandler : IRequestHandler<GetCurrentProfileRequest, ProfileDto?>
{
    private readonly IIdentityContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentProfileHandler(IIdentityContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ProfileDto?> Handle(GetCurrentProfileRequest request, CancellationToken cancellationToken)
    {
        var currentProfileIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("CurrentProfileId")?.Value;
        if (string.IsNullOrEmpty(currentProfileIdClaim) || !Guid.TryParse(currentProfileIdClaim, out var profileId))
        {
            return null;
        }

        var profile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.ProfileId == profileId, cancellationToken);

        return profile?.ToDto();
    }
}
