using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Wedding.Api.Features.Weddings;

namespace WeddingBidders.Wedding.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WeddingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public WeddingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<WeddingDto>> CreateWedding([FromBody] CreateWeddingRequest request)
    {
        try
        {
            var wedding = await _mediator.Send(request);
            return CreatedAtAction(nameof(GetWeddingById), new { id = wedding.WeddingId }, wedding);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<WeddingDto>> GetWeddingById(Guid id)
    {
        var wedding = await _mediator.Send(new GetWeddingByIdRequest { WeddingId = id });
        if (wedding == null)
        {
            return NotFound();
        }
        return Ok(wedding);
    }

    [HttpGet]
    public async Task<ActionResult<List<WeddingDto>>> GetAllWeddings()
    {
        var weddings = await _mediator.Send(new GetAllWeddingsRequest());
        return Ok(weddings);
    }

    [HttpGet("customer/{customerId:guid}")]
    public async Task<ActionResult<List<WeddingDto>>> GetWeddingsByCustomerId(Guid customerId)
    {
        var weddings = await _mediator.Send(new GetWeddingsByCustomerIdRequest { CustomerId = customerId });
        return Ok(weddings);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteWedding(Guid id)
    {
        var result = await _mediator.Send(new DeleteWeddingRequest { WeddingId = id });
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
