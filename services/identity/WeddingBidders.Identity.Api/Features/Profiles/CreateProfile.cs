using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;
using WeddingBidders.Identity.Core.Model;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;

namespace WeddingBidders.Identity.Api.Features.Profiles;

public class CreateProfileRequest : IRequest<ProfileDto>
{
    public Guid UserId { get; set; }
    public Guid AccountId { get; set; }
    public ProfileType ProfileType { get; set; }
}

public class CreateProfileRequestValidator : AbstractValidator<CreateProfileRequest>
{
    public CreateProfileRequestValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.AccountId).NotEmpty();
    }
}

public class CreateProfileHandler : IRequestHandler<CreateProfileRequest, ProfileDto>
{
    private readonly IIdentityContext _context;
    private readonly IEventBus _eventBus;

    public CreateProfileHandler(IIdentityContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<ProfileDto> Handle(CreateProfileRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var profile = new Profile
        {
            ProfileId = Guid.NewGuid(),
            UserId = request.UserId,
            AccountId = request.AccountId,
            ProfileType = request.ProfileType,
            IsPersonalized = false,
            CreatedDate = DateTime.UtcNow
        };

        _context.Profiles.Add(profile);

        if (!user.DefaultProfileId.HasValue)
        {
            user.DefaultProfileId = profile.ProfileId;
            user.CurrentProfileId = profile.ProfileId;
        }

        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new ProfileCreatedEvent
        {
            ProfileId = profile.ProfileId,
            UserId = profile.UserId,
            ProfileType = profile.ProfileType.ToString()
        }, cancellationToken);

        return profile.ToDto();
    }
}
