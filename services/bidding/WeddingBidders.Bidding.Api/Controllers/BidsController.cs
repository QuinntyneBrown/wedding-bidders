using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Bidding.Api.Features.Bids;

namespace WeddingBidders.Bidding.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BidsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BidsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<BidDto>> CreateBid([FromBody] CreateBidRequest request)
    {
        try
        {
            var bid = await _mediator.Send(request);
            return CreatedAtAction(nameof(GetBidsByWeddingId), new { weddingId = bid.WeddingId }, bid);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("wedding/{weddingId:guid}")]
    public async Task<ActionResult<List<BidDto>>> GetBidsByWeddingId(Guid weddingId)
    {
        var bids = await _mediator.Send(new GetBidsByWeddingIdRequest { WeddingId = weddingId });
        return Ok(bids);
    }

    [HttpGet("bidder/{bidderId:guid}")]
    public async Task<ActionResult<List<BidDto>>> GetBidsByBidderId(Guid bidderId)
    {
        var bids = await _mediator.Send(new GetBidsByBidderIdRequest { BidderId = bidderId });
        return Ok(bids);
    }
}
