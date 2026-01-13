using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;
using WeddingBidders.Wedding.Core;
using WeddingBidders.Wedding.Core.Model;

namespace WeddingBidders.Wedding.Api.Features.Weddings;

public class CreateWeddingRequest : IRequest<WeddingDto>
{
    public Guid CustomerId { get; set; }
    public int NumberOfGuests { get; set; }
    public int NumberOfHours { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public List<string> Categories { get; set; } = new();
}

public class CreateWeddingRequestValidator : AbstractValidator<CreateWeddingRequest>
{
    public CreateWeddingRequestValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.NumberOfGuests).GreaterThan(0);
        RuleFor(x => x.NumberOfHours).GreaterThan(0);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Date).GreaterThan(DateTime.Now);
    }
}

public class CreateWeddingHandler : IRequestHandler<CreateWeddingRequest, WeddingDto>
{
    private readonly IWeddingContext _context;
    private readonly IEventBus _eventBus;

    public CreateWeddingHandler(IWeddingContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<WeddingDto> Handle(CreateWeddingRequest request, CancellationToken cancellationToken)
    {
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.CustomerId == request.CustomerId, cancellationToken);

        if (customer == null)
        {
            throw new InvalidOperationException("Customer not found");
        }

        var wedding = new Core.Model.Wedding
        {
            WeddingId = Guid.NewGuid(),
            CustomerId = request.CustomerId,
            NumberOfGuests = request.NumberOfGuests,
            NumberOfHours = request.NumberOfHours,
            Location = request.Location,
            Date = request.Date,
            CreatedDate = DateTime.UtcNow,
            Categories = request.Categories.Select(c => new Category
            {
                CategoryId = Guid.NewGuid(),
                Name = c,
                Description = string.Empty
            }).ToList()
        };

        _context.Weddings.Add(wedding);
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new WeddingCreatedEvent
        {
            WeddingId = wedding.WeddingId,
            CustomerId = wedding.CustomerId ?? Guid.Empty,
            Location = wedding.Location,
            WeddingDate = wedding.Date,
            NumberOfGuests = wedding.NumberOfGuests
        }, cancellationToken);

        return wedding.ToDto();
    }
}
