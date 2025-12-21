using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Bids;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/bid")]
public class BidController : ControllerBase
{
    private readonly IMediator _mediator;

    public BidController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("add")]
    [Authorize]
    public async Task<ActionResult<BidDto>> CreateBid([FromBody] CreateBidRequest request)
    {
        try
        {
            var bid = await _mediator.Send(request);
            return Ok(bid);
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

    [HttpGet("getAllByWeddingId")]
    [Authorize]
    public async Task<ActionResult<GetBidsByWeddingIdResponse>> GetBidsByWeddingId([FromQuery] Guid id)
    {
        var response = await _mediator.Send(new GetBidsByWeddingIdRequest { WeddingId = id });
        return Ok(response.Bids);
    }

    [HttpGet("getAllByCatererId")]
    [Authorize]
    public async Task<ActionResult<GetBidsByBidderIdResponse>> GetBidsByBidderId([FromQuery] Guid id)
    {
        var response = await _mediator.Send(new GetBidsByBidderIdRequest { BidderId = id });
        return Ok(response.Bids);
    }

    [HttpGet("getAllByCurrentProfile")]
    [Authorize]
    public async Task<ActionResult<GetBidsByCurrentProfileResponse>> GetBidsByCurrentProfile()
    {
        var response = await _mediator.Send(new GetBidsByCurrentProfileRequest());
        return Ok(response.Bids);
    }
}
