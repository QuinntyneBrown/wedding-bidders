using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.ProfileAggregate;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;

namespace WeddingBidders.Api.Features.Profiles;

public class CreateProfileRequest : IRequest<CreateProfileResponse>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PasswordConfirmation { get; set; } = string.Empty;
    public string InvitationToken { get; set; } = string.Empty;
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public Guid? AvatarDigitalAssetId { get; set; }
}

public class CreateProfileResponse
{
    public Guid ProfileId { get; set; }
    public Guid UserId { get; set; }
}

public class CreateProfileRequestValidator : AbstractValidator<CreateProfileRequest>
{
    public CreateProfileRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.PasswordConfirmation).Equal(x => x.Password)
            .WithMessage("Password confirmation must match password");
        RuleFor(x => x.InvitationToken).NotEmpty();
        RuleFor(x => x.Firstname).NotEmpty();
        RuleFor(x => x.Lastname).NotEmpty();
    }
}

public class CreateProfileHandler : IRequestHandler<CreateProfileRequest, CreateProfileResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public CreateProfileHandler(IWeddingBiddersContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<CreateProfileResponse> Handle(CreateProfileRequest request, CancellationToken cancellationToken)
    {
        // Validate invitation token
        var invitationToken = await _context.InvitationTokens
            .FirstOrDefaultAsync(t => t.Value == request.InvitationToken, cancellationToken);

        if (invitationToken == null)
        {
            throw new InvalidOperationException("Invalid invitation token");
        }

        if (invitationToken.Expiry.HasValue && invitationToken.Expiry.Value < DateTime.UtcNow)
        {
            throw new InvalidOperationException("Invitation token has expired");
        }

        // Check if username already exists
        var usernameExists = await _context.Users
            .AnyAsync(u => u.Username.ToLower() == request.Email.ToLower(), cancellationToken);

        if (usernameExists)
        {
            throw new InvalidOperationException("Email already exists");
        }

        // Get member role
        var memberRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Member", cancellationToken);

        // Create user
        var salt = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword(request.Password, salt);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.Email,
            Password = hashedPassword,
            Salt = salt,
            Roles = memberRole != null ? new List<Role> { memberRole } : new List<Role>()
        };

        // Create profile
        var profile = new Profile
        {
            ProfileId = Guid.NewGuid(),
            UserId = user.UserId,
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            AvatarDigitalAssetId = request.AvatarDigitalAssetId
        };

        user.DefaultProfileId = profile.ProfileId;
        user.Profiles.Add(profile);

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateProfileResponse
        {
            ProfileId = profile.ProfileId,
            UserId = user.UserId
        };
    }
}
