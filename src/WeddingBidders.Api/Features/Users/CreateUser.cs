using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;

namespace WeddingBidders.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Create, AggregateNames.User)]
public class CreateUserRequest : IRequest<CreateUserResponse>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
}

public class CreateUserResponse
{
    public Guid UserId { get; set; }
}

public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}

public class CreateUserHandler : IRequestHandler<CreateUserRequest, CreateUserResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public CreateUserHandler(IWeddingBiddersContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<CreateUserResponse> Handle(CreateUserRequest request, CancellationToken cancellationToken)
    {
        var existingUser = await _context.Users
            .AnyAsync(u => u.Username == request.Username, cancellationToken);

        if (existingUser)
        {
            throw new InvalidOperationException("Username already exists");
        }

        var salt = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword(request.Password, salt);

        var roles = await _context.Roles
            .Where(r => request.Roles.Contains(r.Name))
            .ToListAsync(cancellationToken);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.Username,
            Password = hashedPassword,
            Salt = salt,
            Roles = roles
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateUserResponse { UserId = user.UserId };
    }
}
