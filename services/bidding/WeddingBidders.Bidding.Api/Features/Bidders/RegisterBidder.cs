using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Bidding.Core;
using WeddingBidders.Bidding.Core.Model;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;

namespace WeddingBidders.Bidding.Api.Features.Bidders;

public class RegisterBidderRequest : IRequest<BidderDto>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? Description { get; set; }
    public Guid ProfileId { get; set; }
    public BidderType BidderType { get; set; }
}

public class RegisterBidderRequestValidator : AbstractValidator<RegisterBidderRequest>
{
    public RegisterBidderRequestValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.ProfileId).NotEmpty();
    }
}

public class RegisterBidderHandler : IRequestHandler<RegisterBidderRequest, BidderDto>
{
    private readonly IBiddingContext _context;
    private readonly IEventBus _eventBus;

    public RegisterBidderHandler(IBiddingContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<BidderDto> Handle(RegisterBidderRequest request, CancellationToken cancellationToken)
    {
        var emailExists = await _context.Bidders
            .AnyAsync(b => b.Email.ToLower() == request.Email.ToLower(), cancellationToken);

        if (emailExists)
        {
            throw new InvalidOperationException("Email already registered");
        }

        var bidder = new Bidder
        {
            BidderId = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            CompanyName = request.CompanyName,
            Description = request.Description,
            ProfileId = request.ProfileId,
            BidderType = request.BidderType,
            IsApproved = false,
            CreatedDate = DateTime.UtcNow
        };

        _context.Bidders.Add(bidder);
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new BidderRegisteredEvent
        {
            BidderId = bidder.BidderId,
            ProfileId = bidder.ProfileId,
            Email = bidder.Email,
            CompanyName = bidder.CompanyName ?? string.Empty,
            BidderType = bidder.BidderType.ToString()
        }, cancellationToken);

        return bidder.ToDto();
    }
}
