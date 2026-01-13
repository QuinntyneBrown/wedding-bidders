using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;
using WeddingBidders.Identity.Core.Model;
using WeddingBidders.Identity.Core.Services;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;

namespace WeddingBidders.Identity.Api.Features.Users;

public class CreateUserRequest : IRequest<UserDto>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}

public class CreateUserHandler : IRequestHandler<CreateUserRequest, UserDto>
{
    private readonly IIdentityContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IEventBus _eventBus;

    public CreateUserHandler(IIdentityContext context, IPasswordHasher passwordHasher, IEventBus eventBus)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _eventBus = eventBus;
    }

    public async Task<UserDto> Handle(CreateUserRequest request, CancellationToken cancellationToken)
    {
        var usernameExists = await _context.Users
            .AnyAsync(u => u.Username.ToLower() == request.Username.ToLower(), cancellationToken);

        if (usernameExists)
        {
            throw new InvalidOperationException("Username already exists");
        }

        var memberRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Member", cancellationToken);

        var salt = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword(request.Password, salt);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.Username,
            Password = hashedPassword,
            Salt = salt,
            Roles = memberRole != null ? new List<Role> { memberRole } : new List<Role>()
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new UserCreatedEvent
        {
            UserId = user.UserId,
            Username = user.Username
        }, cancellationToken);

        return user.ToDto();
    }
}
