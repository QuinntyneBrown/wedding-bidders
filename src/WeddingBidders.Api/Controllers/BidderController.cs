using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Bidders;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/bidder")]
public class BidderController : ControllerBase
{
    private readonly IMediator _mediator;

    public BidderController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<BidderDto>> GetCurrentBidder()
    {
        var bidder = await _mediator.Send(new GetCurrentBidderRequest());
        if (bidder == null)
        {
            return NotFound(new { message = "Bidder not found for current user" });
        }
        return Ok(bidder);
    }

    [HttpGet("getAll")]
    [Authorize]
    public async Task<ActionResult<GetAllBiddersResponse>> GetAllBidders()
    {
        try
        {
            var response = await _mediator.Send(new GetAllBiddersRequest());
            return Ok(response.Bidders);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("getById")]
    [Authorize]
    public async Task<ActionResult<BidderDto>> GetBidderById([FromQuery] Guid id)
    {
        try
        {
            var bidder = await _mediator.Send(new GetBidderByIdRequest { BidderId = id });
            if (bidder == null)
            {
                return NotFound(new { message = "Bidder not found" });
            }
            return Ok(bidder);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("GetByBidId")]
    [Authorize]
    public async Task<ActionResult<BidderDto>> GetBidderByBidId([FromQuery] Guid bidId)
    {
        try
        {
            var bidder = await _mediator.Send(new GetBidderByBidIdRequest { BidId = bidId });
            if (bidder == null)
            {
                return NotFound(new { message = "Bidder not found for the specified bid" });
            }
            return Ok(bidder);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("GetByProfileId")]
    [Authorize]
    public async Task<ActionResult<BidderDto>> GetBidderByProfileId([FromQuery] Guid profileId)
    {
        try
        {
            var bidder = await _mediator.Send(new GetBidderByProfileIdRequest { ProfileId = profileId });
            if (bidder == null)
            {
                return NotFound(new { message = "Bidder not found for the specified profile" });
            }
            return Ok(bidder);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("gettypes")]
    [AllowAnonymous]
    public async Task<ActionResult<GetBidderTypesResponse>> GetBidderTypes()
    {
        var response = await _mediator.Send(new GetBidderTypesRequest());
        return Ok(response.Types);
    }

    [HttpPost("add")]
    [AllowAnonymous]
    public async Task<ActionResult<RegisterBidderResponse>> RegisterBidder([FromBody] RegisterBidderRequest request)
    {
        var response = await _mediator.Send(request);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }
}
