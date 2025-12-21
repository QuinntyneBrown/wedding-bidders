using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.AccountAggregate;
using WeddingBidders.Core.Model.AccountAggregate.Enums;
using WeddingBidders.Core.Model.CustomerAggregate;
using WeddingBidders.Core.Model.ProfileAggregate;
using WeddingBidders.Core.Model.ProfileAggregate.Enums;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;

namespace WeddingBidders.Api.Features.Customers;

public class RegisterCustomerRequest : IRequest<RegisterCustomerResponse>
{
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}

public class RegisterCustomerResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
}

public class RegisterCustomerRequestValidator : AbstractValidator<RegisterCustomerRequest>
{
    public RegisterCustomerRequestValidator()
    {
        RuleFor(x => x.Firstname).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Lastname).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.ConfirmPassword).Equal(x => x.Password).WithMessage("Passwords must match");
    }
}

public class RegisterCustomerHandler : IRequestHandler<RegisterCustomerRequest, RegisterCustomerResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterCustomerHandler(IWeddingBiddersContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<RegisterCustomerResponse> Handle(RegisterCustomerRequest request, CancellationToken cancellationToken)
    {
        var emailExists = await _context.Users.AnyAsync(u => u.Username == request.Email, cancellationToken);
        if (emailExists)
        {
            return new RegisterCustomerResponse
            {
                Success = false,
                Message = "Email already exists"
            };
        }

        var salt = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword(request.Password, salt);

        var memberRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Member", cancellationToken);

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = request.Email,
            Password = hashedPassword,
            Salt = salt,
            Roles = memberRole != null ? new List<Role> { memberRole } : new List<Role>()
        };

        var profile = new Profile
        {
            ProfileId = Guid.NewGuid(),
            UserId = user.UserId,
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            ProfileType = ProfileType.Customer,
            IsApproved = true,
            IsPersonalized = false
        };

        var account = new Account
        {
            AccountId = Guid.NewGuid(),
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            Email = request.Email,
            AccountType = AccountType.Customer,
            AccountStatus = AccountStatus.Free,
            UserId = user.UserId,
            CreatedDate = DateTime.UtcNow
        };

        profile.AccountId = account.AccountId;

        var customer = new Customer
        {
            CustomerId = Guid.NewGuid(),
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            Email = request.Email,
            ProfileId = profile.ProfileId,
            CreatedDate = DateTime.UtcNow
        };

        user.Profiles.Add(profile);
        user.CurrentProfileId = profile.ProfileId;
        user.DefaultProfileId = profile.ProfileId;

        _context.Users.Add(user);
        _context.Accounts.Add(account);
        _context.Customers.Add(customer);

        await _context.SaveChangesAsync(cancellationToken);

        return new RegisterCustomerResponse
        {
            Success = true,
            Message = "Registration successful",
            CustomerId = customer.CustomerId
        };
    }
}
