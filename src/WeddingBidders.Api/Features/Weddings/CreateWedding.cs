using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.WeddingAggregate;

namespace WeddingBidders.Api.Features.Weddings;

public class CreateWeddingRequest : IRequest<WeddingDto>
{
    public int NumberOfGuests { get; set; }
    public int NumberOfHours { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public List<CreateCategoryDto> Categories { get; set; } = new();
}

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
}

public class CreateWeddingRequestValidator : AbstractValidator<CreateWeddingRequest>
{
    public CreateWeddingRequestValidator()
    {
        RuleFor(x => x.NumberOfGuests).GreaterThan(0);
        RuleFor(x => x.NumberOfHours).GreaterThan(0);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Date).GreaterThan(DateTime.UtcNow);
    }
}

public class CreateWeddingHandler : IRequestHandler<CreateWeddingRequest, WeddingDto>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateWeddingHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<WeddingDto> Handle(CreateWeddingRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }

        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Email.ToLower() == username.ToLower(), cancellationToken);

        if (customer == null)
        {
            throw new InvalidOperationException("Customer not found");
        }

        var wedding = new Wedding
        {
            WeddingId = Guid.NewGuid(),
            NumberOfGuests = request.NumberOfGuests,
            NumberOfHours = request.NumberOfHours,
            Location = request.Location,
            Date = request.Date,
            CustomerId = customer.CustomerId,
            CreatedDate = DateTime.UtcNow
        };

        foreach (var categoryDto in request.Categories)
        {
            wedding.Categories.Add(new Category
            {
                CategoryId = Guid.NewGuid(),
                Name = categoryDto.Name,
                WeddingId = wedding.WeddingId
            });
        }

        _context.Weddings.Add(wedding);
        await _context.SaveChangesAsync(cancellationToken);

        return wedding.ToDto();
    }
}
