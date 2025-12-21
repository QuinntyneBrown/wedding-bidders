using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.AccountAggregate.Enums;
using WeddingBidders.Core.Model.SubscriptionAggregate;

namespace WeddingBidders.Api.Features.Subscriptions;

public class ChargeSubscriptionRequest : IRequest<ChargeSubscriptionResponse>
{
    public string Token { get; set; } = string.Empty;
}

public class ChargeSubscriptionResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class ChargeSubscriptionRequestValidator : AbstractValidator<ChargeSubscriptionRequest>
{
    public ChargeSubscriptionRequestValidator()
    {
        RuleFor(x => x.Token).NotEmpty();
    }
}

public class ChargeSubscriptionHandler : IRequestHandler<ChargeSubscriptionRequest, ChargeSubscriptionResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ChargeSubscriptionHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ChargeSubscriptionResponse> Handle(ChargeSubscriptionRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }

        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Email.ToLower() == username.ToLower(), cancellationToken);

        if (account == null)
        {
            throw new InvalidOperationException("Account not found");
        }

        // In production, integrate with Stripe here
        // For now, we'll simulate a successful payment
        var payment = new Payment
        {
            PaymentId = Guid.NewGuid(),
            AccountId = account.AccountId,
            Amount = 180.00m,
            PaymentDate = DateTime.UtcNow,
            CreatedDate = DateTime.UtcNow
        };

        var plan = await _context.Plans.FirstOrDefaultAsync(cancellationToken);
        if (plan == null)
        {
            plan = new Plan
            {
                PlanId = Guid.NewGuid(),
                Description = "Annual Membership",
                Price = 180.00m,
                CreatedDate = DateTime.UtcNow
            };
            _context.Plans.Add(plan);
        }

        var subscription = new Subscription
        {
            SubscriptionId = Guid.NewGuid(),
            AccountId = account.AccountId,
            PlanId = plan.PlanId,
            EffectiveDate = DateTime.UtcNow,
            ExpiryDate = DateTime.UtcNow.AddYears(1),
            CreatedDate = DateTime.UtcNow
        };

        account.AccountStatus = AccountStatus.Paid;

        _context.Payments.Add(payment);
        _context.Subscriptions.Add(subscription);
        await _context.SaveChangesAsync(cancellationToken);

        return new ChargeSubscriptionResponse
        {
            Success = true,
            Message = "Payment processed successfully"
        };
    }
}
