using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Identity.Api.Features.Profiles;

namespace WeddingBidders.Identity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfilesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfilesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<ProfileDto>> CreateProfile([FromBody] CreateProfileRequest request)
    {
        try
        {
            var profile = await _mediator.Send(request);
            return CreatedAtAction(nameof(GetProfileById), new { id = profile.ProfileId }, profile);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProfileDto>> GetProfileById(Guid id)
    {
        var profile = await _mediator.Send(new GetProfileByIdRequest { ProfileId = id });
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(profile);
    }

    [HttpGet("current")]
    public async Task<ActionResult<ProfileDto>> GetCurrentProfile()
    {
        var profile = await _mediator.Send(new GetCurrentProfileRequest());
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(profile);
    }
}
