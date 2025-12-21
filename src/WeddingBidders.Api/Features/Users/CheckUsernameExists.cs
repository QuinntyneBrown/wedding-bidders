using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Users;

public class CheckUsernameExistsRequest : IRequest<bool>
{
    public string Username { get; set; } = string.Empty;
}

public class CheckUsernameExistsHandler : IRequestHandler<CheckUsernameExistsRequest, bool>
{
    private readonly IWeddingBiddersContext _context;

    public CheckUsernameExistsHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(CheckUsernameExistsRequest request, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AnyAsync(u => u.Username.ToLower() == request.Username.ToLower(), cancellationToken);
    }
}
