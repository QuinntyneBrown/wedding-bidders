using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Bidding.Core;
using WeddingBidders.Bidding.Core.Model;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;

namespace WeddingBidders.Bidding.Api.Features.Bids;

public class CreateBidRequest : IRequest<BidDto>
{
    public Guid WeddingId { get; set; }
    public Guid BidderId { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class CreateBidRequestValidator : AbstractValidator<CreateBidRequest>
{
    public CreateBidRequestValidator()
    {
        RuleFor(x => x.WeddingId).NotEmpty();
        RuleFor(x => x.BidderId).NotEmpty();
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
    }
}

public class CreateBidHandler : IRequestHandler<CreateBidRequest, BidDto>
{
    private readonly IBiddingContext _context;
    private readonly IEventBus _eventBus;

    public CreateBidHandler(IBiddingContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<BidDto> Handle(CreateBidRequest request, CancellationToken cancellationToken)
    {
        var bidder = await _context.Bidders
            .FirstOrDefaultAsync(b => b.BidderId == request.BidderId, cancellationToken);

        if (bidder == null)
        {
            throw new InvalidOperationException("Bidder not found");
        }

        if (!bidder.IsApproved)
        {
            throw new InvalidOperationException("Bidder is not approved");
        }

        var bid = new Bid
        {
            BidId = Guid.NewGuid(),
            WeddingId = request.WeddingId,
            BidderId = request.BidderId,
            Price = request.Price,
            Description = request.Description,
            Status = BidStatus.Pending,
            CreatedDate = DateTime.UtcNow
        };

        _context.Bids.Add(bid);
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new BidCreatedEvent
        {
            BidId = bid.BidId,
            WeddingId = bid.WeddingId,
            BidderId = bid.BidderId,
            Price = bid.Price,
            Description = bid.Description
        }, cancellationToken);

        return bid.ToDto();
    }
}
