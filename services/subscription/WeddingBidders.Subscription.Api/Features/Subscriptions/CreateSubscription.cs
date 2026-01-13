using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;
using WeddingBidders.Subscription.Core;
using WeddingBidders.Subscription.Core.Model;

namespace WeddingBidders.Subscription.Api.Features.Subscriptions;

public class CreateSubscriptionRequest : IRequest<SubscriptionDto>
{
    public Guid AccountId { get; set; }
    public Guid PlanId { get; set; }
}

public class CreateSubscriptionRequestValidator : AbstractValidator<CreateSubscriptionRequest>
{
    public CreateSubscriptionRequestValidator()
    {
        RuleFor(x => x.AccountId).NotEmpty();
        RuleFor(x => x.PlanId).NotEmpty();
    }
}

public class CreateSubscriptionHandler : IRequestHandler<CreateSubscriptionRequest, SubscriptionDto>
{
    private readonly ISubscriptionContext _context;
    private readonly IEventBus _eventBus;

    public CreateSubscriptionHandler(ISubscriptionContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<SubscriptionDto> Handle(CreateSubscriptionRequest request, CancellationToken cancellationToken)
    {
        var plan = await _context.Plans
            .FirstOrDefaultAsync(p => p.PlanId == request.PlanId, cancellationToken);

        if (plan == null)
        {
            throw new InvalidOperationException("Plan not found");
        }

        var subscription = new Core.Model.Subscription
        {
            SubscriptionId = Guid.NewGuid(),
            AccountId = request.AccountId,
            PlanId = request.PlanId,
            Plan = plan,
            EffectiveDate = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddDays(plan.DurationDays),
            Status = SubscriptionStatus.Active,
            CreatedDate = DateTime.UtcNow
        };

        _context.Subscriptions.Add(subscription);
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new SubscriptionCreatedEvent
        {
            SubscriptionId = subscription.SubscriptionId,
            AccountId = subscription.AccountId,
            PlanId = subscription.PlanId,
            EffectiveDate = subscription.EffectiveDate,
            ExpiryDate = subscription.ExpiryDate
        }, cancellationToken);

        return subscription.ToDto();
    }
}
