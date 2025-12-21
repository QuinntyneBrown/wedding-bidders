using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Subscriptions;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/subscription")]
public class SubscriptionController : ControllerBase
{
    private readonly IMediator _mediator;

    public SubscriptionController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("charge")]
    [Authorize]
    public async Task<ActionResult<ChargeSubscriptionResponse>> ChargeSubscription([FromBody] ChargeSubscriptionRequest request)
    {
        try
        {
            var response = await _mediator.Send(request);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
