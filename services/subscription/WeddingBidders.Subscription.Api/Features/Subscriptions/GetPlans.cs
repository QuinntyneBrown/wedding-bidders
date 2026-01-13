using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Subscription.Core;

namespace WeddingBidders.Subscription.Api.Features.Subscriptions;

public class GetPlansRequest : IRequest<List<PlanDto>>
{
}

public class GetPlansHandler : IRequestHandler<GetPlansRequest, List<PlanDto>>
{
    private readonly ISubscriptionContext _context;

    public GetPlansHandler(ISubscriptionContext context)
    {
        _context = context;
    }

    public async Task<List<PlanDto>> Handle(GetPlansRequest request, CancellationToken cancellationToken)
    {
        var plans = await _context.Plans.ToListAsync(cancellationToken);
        return plans.Select(p => p.ToDto()).ToList();
    }
}
