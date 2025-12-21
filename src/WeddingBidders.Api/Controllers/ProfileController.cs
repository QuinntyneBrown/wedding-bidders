using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Profiles;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfileController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<CreateProfileResponse>> CreateProfile([FromBody] CreateProfileRequest request)
    {
        try
        {
            var response = await _mediator.Send(request);
            return CreatedAtAction(nameof(GetCurrentProfile), response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<ProfileDto>> GetCurrentProfile()
    {
        var response = await _mediator.Send(new GetCurrentProfileRequest());
        if (response == null) return NotFound();
        return Ok(response);
    }
}
