using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Write, AggregateNames.User)]
public class UpdateUserRequest : IRequest<UpdateUserResponse>
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
}

public class UpdateUserResponse
{
    public bool Success { get; set; }
}

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Username).NotEmpty().EmailAddress();
    }
}

public class UpdateUserHandler : IRequestHandler<UpdateUserRequest, UpdateUserResponse>
{
    private readonly IWeddingBiddersContext _context;

    public UpdateUserHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<UpdateUserResponse> Handle(UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var usernameExists = await _context.Users
            .AnyAsync(u => u.Username == request.Username && u.UserId != request.UserId, cancellationToken);

        if (usernameExists)
        {
            throw new InvalidOperationException("Username already exists");
        }

        var roles = await _context.Roles
            .Where(r => request.Roles.Contains(r.Name))
            .ToListAsync(cancellationToken);

        user.Username = request.Username;
        user.Roles.Clear();
        foreach (var role in roles)
        {
            user.Roles.Add(role);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateUserResponse { Success = true };
    }
}
