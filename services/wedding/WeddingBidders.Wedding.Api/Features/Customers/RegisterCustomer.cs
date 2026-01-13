using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;
using WeddingBidders.Wedding.Core;
using WeddingBidders.Wedding.Core.Model;

namespace WeddingBidders.Wedding.Api.Features.Customers;

public class RegisterCustomerRequest : IRequest<CustomerDto>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid ProfileId { get; set; }
}

public class RegisterCustomerRequestValidator : AbstractValidator<RegisterCustomerRequest>
{
    public RegisterCustomerRequestValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.ProfileId).NotEmpty();
    }
}

public class RegisterCustomerHandler : IRequestHandler<RegisterCustomerRequest, CustomerDto>
{
    private readonly IWeddingContext _context;
    private readonly IEventBus _eventBus;

    public RegisterCustomerHandler(IWeddingContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<CustomerDto> Handle(RegisterCustomerRequest request, CancellationToken cancellationToken)
    {
        var emailExists = await _context.Customers
            .AnyAsync(c => c.Email.ToLower() == request.Email.ToLower(), cancellationToken);

        if (emailExists)
        {
            throw new InvalidOperationException("Email already registered");
        }

        var customer = new Customer
        {
            CustomerId = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            ProfileId = request.ProfileId,
            CreatedDate = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new CustomerRegisteredEvent
        {
            CustomerId = customer.CustomerId,
            ProfileId = customer.ProfileId,
            Email = customer.Email,
            FirstName = customer.FirstName,
            LastName = customer.LastName
        }, cancellationToken);

        return customer.ToDto();
    }
}
