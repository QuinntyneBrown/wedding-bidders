using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Profiles;

public class GetProfileByIdRequest : IRequest<ProfileDto?>
{
    public Guid ProfileId { get; set; }
}

public class GetProfileByIdHandler : IRequestHandler<GetProfileByIdRequest, ProfileDto?>
{
    private readonly IWeddingBiddersContext _context;

    public GetProfileByIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<ProfileDto?> Handle(GetProfileByIdRequest request, CancellationToken cancellationToken)
    {
        var profile = await _context.Profiles
            .Include(p => p.Account)
            .FirstOrDefaultAsync(p => p.ProfileId == request.ProfileId, cancellationToken);

        return profile?.ToDto();
    }
}
