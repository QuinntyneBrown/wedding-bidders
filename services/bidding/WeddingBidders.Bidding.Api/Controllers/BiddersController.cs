using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Bidding.Api.Features.Bidders;

namespace WeddingBidders.Bidding.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BiddersController : ControllerBase
{
    private readonly IMediator _mediator;

    public BiddersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<ActionResult<BidderDto>> RegisterBidder([FromBody] RegisterBidderRequest request)
    {
        try
        {
            var bidder = await _mediator.Send(request);
            return CreatedAtAction(nameof(GetBidderById), new { id = bidder.BidderId }, bidder);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<BidderDto>>> GetAllBidders()
    {
        var bidders = await _mediator.Send(new GetAllBiddersRequest());
        return Ok(bidders);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BidderDto>> GetBidderById(Guid id)
    {
        var bidder = await _mediator.Send(new GetBidderByIdRequest { BidderId = id });
        if (bidder == null)
        {
            return NotFound();
        }
        return Ok(bidder);
    }
}
