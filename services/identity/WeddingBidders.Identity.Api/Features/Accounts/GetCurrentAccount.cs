using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;

namespace WeddingBidders.Identity.Api.Features.Accounts;

public class GetCurrentAccountRequest : IRequest<AccountDto?>
{
}

public class GetCurrentAccountHandler : IRequestHandler<GetCurrentAccountRequest, AccountDto?>
{
    private readonly IIdentityContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentAccountHandler(IIdentityContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<AccountDto?> Handle(GetCurrentAccountRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return null;
        }

        var account = await _context.Accounts
            .Include(a => a.Profiles)
            .FirstOrDefaultAsync(a => a.User != null && a.User.Username == username, cancellationToken);

        return account?.ToDto();
    }
}
