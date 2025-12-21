using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Accounts;

public class GetCurrentAccountRequest : IRequest<AccountDto?>
{
}

public class GetCurrentAccountHandler : IRequestHandler<GetCurrentAccountRequest, AccountDto?>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentAccountHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<AccountDto?> Handle(GetCurrentAccountRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return null;
        }

        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Email.ToLower() == username.ToLower(), cancellationToken);

        return account?.ToDto();
    }
}
