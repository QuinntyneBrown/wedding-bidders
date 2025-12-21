using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.User)]
public class GetUserByIdRequest : IRequest<UserDto?>
{
    public Guid UserId { get; set; }
}

public class GetUserByIdHandler : IRequestHandler<GetUserByIdRequest, UserDto?>
{
    private readonly IWeddingBiddersContext _context;

    public GetUserByIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<UserDto?> Handle(GetUserByIdRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

        if (user == null) return null;

        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            Roles = user.Roles.Select(r => r.Name).ToList(),
            DefaultProfileId = user.DefaultProfileId
        };
    }
}
