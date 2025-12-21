using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Weddings;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/wedding")]
public class WeddingController : ControllerBase
{
    private readonly IMediator _mediator;

    public WeddingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("getAll")]
    [Authorize]
    public async Task<ActionResult<GetAllWeddingsResponse>> GetAllWeddings()
    {
        try
        {
            var response = await _mediator.Send(new GetAllWeddingsRequest());
            return Ok(response.Weddings);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("getById")]
    [Authorize]
    public async Task<ActionResult<WeddingDto>> GetWeddingById([FromQuery] Guid id)
    {
        try
        {
            var wedding = await _mediator.Send(new GetWeddingByIdRequest { WeddingId = id });
            if (wedding == null)
            {
                return NotFound(new { message = "Wedding not found" });
            }
            return Ok(wedding);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("getAllByCustomerId")]
    [Authorize]
    public async Task<ActionResult<GetWeddingsByCustomerIdResponse>> GetWeddingsByCustomerId([FromQuery] Guid id)
    {
        try
        {
            var response = await _mediator.Send(new GetWeddingsByCustomerIdRequest { CustomerId = id });
            return Ok(response.Weddings);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("getAllByCurrentProfile")]
    [Authorize]
    public async Task<ActionResult<GetWeddingsByCurrentProfileResponse>> GetWeddingsByCurrentProfile()
    {
        var response = await _mediator.Send(new GetWeddingsByCurrentProfileRequest());
        return Ok(response.Weddings);
    }

    [HttpPost("add")]
    [Authorize]
    public async Task<ActionResult<WeddingDto>> CreateWedding([FromBody] CreateWeddingRequest request)
    {
        try
        {
            var wedding = await _mediator.Send(request);
            return Ok(wedding);
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

    [HttpPut("update")]
    [Authorize]
    public async Task<ActionResult<WeddingDto>> UpdateWedding([FromBody] UpdateWeddingRequest request)
    {
        try
        {
            var wedding = await _mediator.Send(request);
            if (wedding == null)
            {
                return NotFound(new { message = "Wedding not found" });
            }
            return Ok(wedding);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpDelete("remove")]
    [Authorize]
    public async Task<ActionResult> DeleteWedding([FromQuery] Guid id)
    {
        try
        {
            var result = await _mediator.Send(new DeleteWeddingRequest { WeddingId = id });
            if (!result)
            {
                return NotFound(new { message = "Wedding not found" });
            }
            return Ok();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
