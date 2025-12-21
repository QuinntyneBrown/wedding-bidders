using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Weddings;

[AuthorizeResourceOperation(Operations.Write, AggregateNames.Wedding)]
public class UpdateWeddingRequest : IRequest<WeddingDto?>
{
    public Guid WeddingId { get; set; }
    public int NumberOfGuests { get; set; }
    public int NumberOfHours { get; set; }
    public string Location { get; set; } = string.Empty;
}

public class UpdateWeddingRequestValidator : AbstractValidator<UpdateWeddingRequest>
{
    public UpdateWeddingRequestValidator()
    {
        RuleFor(x => x.WeddingId).NotEmpty();
        RuleFor(x => x.NumberOfGuests).GreaterThan(0);
        RuleFor(x => x.NumberOfHours).GreaterThan(0);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(500);
    }
}

public class UpdateWeddingHandler : IRequestHandler<UpdateWeddingRequest, WeddingDto?>
{
    private readonly IWeddingBiddersContext _context;

    public UpdateWeddingHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<WeddingDto?> Handle(UpdateWeddingRequest request, CancellationToken cancellationToken)
    {
        var wedding = await _context.Weddings
            .Include(w => w.Categories)
            .FirstOrDefaultAsync(w => w.WeddingId == request.WeddingId, cancellationToken);

        if (wedding == null)
        {
            return null;
        }

        wedding.NumberOfGuests = request.NumberOfGuests;
        wedding.NumberOfHours = request.NumberOfHours;
        wedding.Location = request.Location;
        wedding.LastModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return wedding.ToDto();
    }
}
