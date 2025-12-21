using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.BidAggregate;

namespace WeddingBidders.Api.Features.Bids;

public class CreateBidRequest : IRequest<BidDto>
{
    public Guid WeddingId { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class CreateBidRequestValidator : AbstractValidator<CreateBidRequest>
{
    public CreateBidRequestValidator()
    {
        RuleFor(x => x.WeddingId).NotEmpty();
        RuleFor(x => x.Price).GreaterThan(0);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
    }
}

public class CreateBidHandler : IRequestHandler<CreateBidRequest, BidDto>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateBidHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<BidDto> Handle(CreateBidRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }

        var bidder = await _context.Bidders
            .FirstOrDefaultAsync(b => b.Email.ToLower() == username.ToLower(), cancellationToken);

        if (bidder == null)
        {
            throw new InvalidOperationException("Bidder not found");
        }

        var wedding = await _context.Weddings
            .FirstOrDefaultAsync(w => w.WeddingId == request.WeddingId, cancellationToken);

        if (wedding == null)
        {
            throw new InvalidOperationException("Wedding not found");
        }

        var bid = new Bid
        {
            BidId = Guid.NewGuid(),
            BidderId = bidder.BidderId,
            WeddingId = request.WeddingId,
            Price = request.Price,
            Description = request.Description,
            CreatedDate = DateTime.UtcNow
        };

        _context.Bids.Add(bid);
        await _context.SaveChangesAsync(cancellationToken);

        return bid.ToDto();
    }
}
