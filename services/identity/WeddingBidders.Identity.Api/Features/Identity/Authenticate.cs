using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;
using WeddingBidders.Identity.Core.Services;

namespace WeddingBidders.Identity.Api.Features.Identity;

public class AuthenticateRequest : IRequest<AuthenticateResponse>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthenticateResponse
{
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
}

public class AuthenticateRequestValidator : AbstractValidator<AuthenticateRequest>
{
    public AuthenticateRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().WithMessage("Username is required");
        RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
    }
}

public class AuthenticateHandler : IRequestHandler<AuthenticateRequest, AuthenticateResponse>
{
    private readonly IIdentityContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthenticateHandler(
        IIdentityContext context,
        IPasswordHasher passwordHasher,
        ITokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<AuthenticateResponse> Handle(AuthenticateRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .ThenInclude(r => r.Privileges)
            .FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        var isValidPassword = _passwordHasher.VerifyPassword(request.Password, user.Password, user.Salt);
        if (!isValidPassword)
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        var token = _tokenService.GenerateToken(user);

        return new AuthenticateResponse
        {
            UserId = user.UserId,
            Token = token
        };
    }
}
