using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Accounts;

public class GetBillingRequest : IRequest<BillingDto?>
{
}

public class GetBillingHandler : IRequestHandler<GetBillingRequest, BillingDto?>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetBillingHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<BillingDto?> Handle(GetBillingRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return null;
        }

        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Email.ToLower() == username.ToLower(), cancellationToken);

        if (account == null)
        {
            return null;
        }

        var lastPayment = await _context.Payments
            .Where(p => p.AccountId == account.AccountId)
            .OrderByDescending(p => p.PaymentDate)
            .FirstOrDefaultAsync(cancellationToken);

        var subscription = await _context.Subscriptions
            .Where(s => s.AccountId == account.AccountId)
            .OrderByDescending(s => s.ExpiryDate)
            .FirstOrDefaultAsync(cancellationToken);

        return new BillingDto
        {
            AccountStatus = account.AccountStatus,
            SubscriptionExpiry = subscription?.ExpiryDate,
            LastPaymentAmount = lastPayment?.Amount,
            LastPaymentDate = lastPayment?.PaymentDate
        };
    }
}
