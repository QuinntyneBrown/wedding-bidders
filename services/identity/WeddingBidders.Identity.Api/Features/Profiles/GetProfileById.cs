using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;

namespace WeddingBidders.Identity.Api.Features.Profiles;

public class GetProfileByIdRequest : IRequest<ProfileDto?>
{
    public Guid ProfileId { get; set; }
}

public class GetProfileByIdHandler : IRequestHandler<GetProfileByIdRequest, ProfileDto?>
{
    private readonly IIdentityContext _context;

    public GetProfileByIdHandler(IIdentityContext context)
    {
        _context = context;
    }

    public async Task<ProfileDto?> Handle(GetProfileByIdRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.ProfileId == request.ProfileId, cancellationToken);

        return profile?.ToDto();
    }
}
