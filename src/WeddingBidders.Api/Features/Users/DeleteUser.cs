using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Delete, AggregateNames.User)]
public class DeleteUserRequest : IRequest<DeleteUserResponse>
{
    public Guid UserId { get; set; }
}

public class DeleteUserResponse
{
    public bool Success { get; set; }
}

public class DeleteUserHandler : IRequestHandler<DeleteUserRequest, DeleteUserResponse>
{
    private readonly IWeddingBiddersContext _context;

    public DeleteUserHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<DeleteUserResponse> Handle(DeleteUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        user.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);

        return new DeleteUserResponse { Success = true };
    }
}
