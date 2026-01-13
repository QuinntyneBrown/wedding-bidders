using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Api.Features.Users;
using WeddingBidders.Identity.Core;

namespace WeddingBidders.Identity.Api.Features.Identity;

public class GetCurrentUserRequest : IRequest<UserDto?>
{
}

public class GetCurrentUserHandler : IRequestHandler<GetCurrentUserRequest, UserDto?>
{
    private readonly IIdentityContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentUserHandler(IIdentityContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<UserDto?> Handle(GetCurrentUserRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return null;
        }

        var user = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .FirstOrDefaultAsync(u => u.Username == username, cancellationToken);

        return user?.ToDto();
    }
}
