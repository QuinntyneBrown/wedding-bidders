using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Services;

namespace WeddingBidders.Api.Features.Identity;

public class ChangePasswordRequest : IRequest<ChangePasswordResponse>
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmationPassword { get; set; } = string.Empty;
}

public class ChangePasswordResponse
{
    public bool Success { get; set; }
}

public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordRequestValidator()
    {
        RuleFor(x => x.OldPassword).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6);
        RuleFor(x => x.NewPassword).Must((cmd, newPassword) => newPassword != cmd.OldPassword)
            .WithMessage("New password must be different from old password");
        RuleFor(x => x.ConfirmationPassword).NotEmpty()
            .Equal(x => x.NewPassword)
            .WithMessage("Password confirmation must match new password");
    }
}

public class ChangePasswordHandler : IRequestHandler<ChangePasswordRequest, ChangePasswordResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ChangePasswordHandler(
        IWeddingBiddersContext context,
        IPasswordHasher passwordHasher,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ChangePasswordResponse> Handle(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        var isValidPassword = _passwordHasher.VerifyPassword(request.OldPassword, user.Password, user.Salt);
        if (!isValidPassword)
        {
            throw new UnauthorizedAccessException("Current password is incorrect");
        }

        var newSalt = _passwordHasher.GenerateSalt();
        var newHashedPassword = _passwordHasher.HashPassword(request.NewPassword, newSalt);

        user.Password = newHashedPassword;
        user.Salt = newSalt;

        await _context.SaveChangesAsync(cancellationToken);

        return new ChangePasswordResponse { Success = true };
    }
}
