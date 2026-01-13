using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Subscription.Api.Features.Subscriptions;

namespace WeddingBidders.Subscription.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubscriptionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SubscriptionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<SubscriptionDto>> CreateSubscription([FromBody] CreateSubscriptionRequest request)
    {
        try
        {
            var subscription = await _mediator.Send(request);
            return CreatedAtAction(nameof(GetPlans), subscription);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("plans")]
    [AllowAnonymous]
    public async Task<ActionResult<List<PlanDto>>> GetPlans()
    {
        var plans = await _mediator.Send(new GetPlansRequest());
        return Ok(plans);
    }
}
