using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;
using WeddingBidders.Core.Services;

namespace WeddingBidders.Api.Features.Users;

[AuthorizeResourceOperation(Operations.Write, AggregateNames.User)]
public class UpdatePasswordRequest : IRequest<UpdatePasswordResponse>
{
    public Guid UserId { get; set; }
    public string Password { get; set; } = string.Empty;
}

public class UpdatePasswordResponse
{
    public bool Success { get; set; }
}

public class UpdatePasswordRequestValidator : AbstractValidator<UpdatePasswordRequest>
{
    public UpdatePasswordRequestValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}

public class UpdatePasswordHandler : IRequestHandler<UpdatePasswordRequest, UpdatePasswordResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public UpdatePasswordHandler(IWeddingBiddersContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<UpdatePasswordResponse> Handle(UpdatePasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var newSalt = _passwordHasher.GenerateSalt();
        var newHashedPassword = _passwordHasher.HashPassword(request.Password, newSalt);

        user.Password = newHashedPassword;
        user.Salt = newSalt;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdatePasswordResponse { Success = true };
    }
}
