using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Profiles;

public class UpdateIsPersonalizedRequest : IRequest<Unit>
{
}

public class UpdateIsPersonalizedHandler : IRequestHandler<UpdateIsPersonalizedRequest, Unit>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateIsPersonalizedHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Unit> Handle(UpdateIsPersonalizedRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unit.Value;
        }

        var profile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

        if (profile != null)
        {
            profile.IsPersonalized = true;
            await _context.SaveChangesAsync(cancellationToken);
        }

        return Unit.Value;
    }
}
