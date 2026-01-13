using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;

namespace WeddingBidders.Identity.Api.Features.Users;

public class GetUserByIdRequest : IRequest<UserDto?>
{
    public Guid UserId { get; set; }
}

public class GetUserByIdHandler : IRequestHandler<GetUserByIdRequest, UserDto?>
{
    private readonly IIdentityContext _context;

    public GetUserByIdHandler(IIdentityContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> Handle(GetUserByIdRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

        return user?.ToDto();
    }
}
