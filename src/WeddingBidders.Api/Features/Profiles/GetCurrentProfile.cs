using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Profiles;

public class GetCurrentProfileRequest : IRequest<ProfileDto?>
{
}

public class GetCurrentProfileHandler : IRequestHandler<GetCurrentProfileRequest, ProfileDto?>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentProfileHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ProfileDto?> Handle(GetCurrentProfileRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return null;
        }

        var profile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

        if (profile == null) return null;

        return new ProfileDto
        {
            ProfileId = profile.ProfileId,
            UserId = profile.UserId,
            Firstname = profile.Firstname,
            Lastname = profile.Lastname,
            AvatarDigitalAssetId = profile.AvatarDigitalAssetId,
            PhoneNumber = profile.PhoneNumber
        };
    }
}
