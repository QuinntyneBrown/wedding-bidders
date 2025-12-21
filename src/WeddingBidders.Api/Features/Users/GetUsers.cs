using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.User)]
public class GetUsersRequest : IRequest<GetUsersResponse>
{
}

public class GetUsersResponse
{
    public List<UserDto> Users { get; set; } = new();
}

public class GetUsersHandler : IRequestHandler<GetUsersRequest, GetUsersResponse>
{
    private readonly IWeddingBiddersContext _context;

    public GetUsersHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<GetUsersResponse> Handle(GetUsersRequest request, CancellationToken cancellationToken)
    {
        var users = await _context.Users
            .Include(u => u.Roles)
            .Select(u => new UserDto
            {
                UserId = u.UserId,
                Username = u.Username,
                Roles = u.Roles.Select(r => r.Name).ToList(),
                DefaultProfileId = u.DefaultProfileId
            })
            .ToListAsync(cancellationToken);

        return new GetUsersResponse { Users = users };
    }
}
