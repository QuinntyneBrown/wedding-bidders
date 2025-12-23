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

    [HttpGet("getProfileById")]
    [Authorize]
    public async Task<ActionResult<ProfileDto>> GetProfileById([FromQuery] Guid id)
    {
        var response = await _mediator.Send(new GetProfileByIdRequest { ProfileId = id });
        if (response == null) return NotFound();
        return Ok(response);
    }

    [HttpGet("getByBidId")]
    [Authorize]
    public async Task<ActionResult<ProfileDto>> GetByBidId([FromQuery] Guid bidId)
    {
        var response = await _mediator.Send(new GetProfileByBidIdRequest { BidId = bidId });
        if (response == null) return NotFound();
        return Ok(response);
    }

    [HttpGet("getOthers")]
    [Authorize]
    public async Task<ActionResult<List<ProfileDto>>> GetOthers()
    {
        var response = await _mediator.Send(new GetOtherProfilesRequest());
        return Ok(response);
    }

    [HttpPost("personalized")]
    [Authorize]
    public async Task<ActionResult> UpdateIsPersonalized()
    {
        await _mediator.Send(new UpdateIsPersonalizedRequest());
        return Ok();
    }
}
