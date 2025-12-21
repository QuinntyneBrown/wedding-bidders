using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.AccountAggregate;
using WeddingBidders.Core.Model.AccountAggregate.Enums;
using WeddingBidders.Core.Model.BidderAggregate;
using WeddingBidders.Core.Model.BidderAggregate.Enums;
using WeddingBidders.Core.Model.ProfileAggregate;
using WeddingBidders.Core.Model.ProfileAggregate.Enums;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;

namespace WeddingBidders.Api.Features.Bidders;

public class RegisterBidderRequest : IRequest<RegisterBidderResponse>
{
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? Description { get; set; }
    public BidderType BidderType { get; set; }
}

public class RegisterBidderResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public Guid? BidderId { get; set; }
}

public class RegisterBidderRequestValidator : AbstractValidator<RegisterBidderRequest>
{
    public RegisterBidderRequestValidator()
    {
        RuleFor(x => x.Firstname).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Lastname).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.ConfirmPassword).Equal(x => x.Password).WithMessage("Passwords must match");
        RuleFor(x => x.BidderType).IsInEnum();
    }
}

public class RegisterBidderHandler : IRequestHandler<RegisterBidderRequest, RegisterBidderResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterBidderHandler(IWeddingBiddersContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<RegisterBidderResponse> Handle(RegisterBidderRequest request, CancellationToken cancellationToken)
    {
        var emailExists = await _context.Users.AnyAsync(u => u.Username == request.Email, cancellationToken);
        if (emailExists)
        {
            return new RegisterBidderResponse
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

        var profileType = MapBidderTypeToProfileType(request.BidderType);

        var profile = new Profile
        {
            ProfileId = Guid.NewGuid(),
            UserId = user.UserId,
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            ProfileType = profileType,
            IsApproved = false,
            IsPersonalized = false
        };

        var account = new Account
        {
            AccountId = Guid.NewGuid(),
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            Email = request.Email,
            AccountType = AccountType.Bidder,
            AccountStatus = AccountStatus.Free,
            UserId = user.UserId,
            CreatedDate = DateTime.UtcNow
        };

        profile.AccountId = account.AccountId;

        var bidder = new Bidder
        {
            BidderId = Guid.NewGuid(),
            Firstname = request.Firstname,
            Lastname = request.Lastname,
            Email = request.Email,
            CompanyName = request.CompanyName,
            Description = request.Description,
            BidderType = request.BidderType,
            ProfileId = profile.ProfileId,
            IsApproved = false,
            CreatedDate = DateTime.UtcNow
        };

        user.Profiles.Add(profile);
        user.CurrentProfileId = profile.ProfileId;
        user.DefaultProfileId = profile.ProfileId;

        _context.Users.Add(user);
        _context.Accounts.Add(account);
        _context.Bidders.Add(bidder);

        await _context.SaveChangesAsync(cancellationToken);

        return new RegisterBidderResponse
        {
            Success = true,
            Message = "Registration successful",
            BidderId = bidder.BidderId
        };
    }

    private static ProfileType MapBidderTypeToProfileType(BidderType bidderType)
    {
        return bidderType switch
        {
            BidderType.Caterer => ProfileType.Caterer,
            BidderType.Photographer => ProfileType.Photographer,
            BidderType.MakeUpArtist => ProfileType.MakeUpArtist,
            BidderType.EventPlanner => ProfileType.EventPlanner,
            BidderType.DiscJockey => ProfileType.DiscJockey,
            _ => ProfileType.Caterer
        };
    }
}
