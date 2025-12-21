using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Identity;
using WeddingBidders.Api.Features.Users;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("token")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthenticateResponse>> Authenticate([FromBody] AuthenticateRequest request)
    {
        try
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<GetCurrentUserResponse>> GetCurrentUser()
    {
        try
        {
            var response = await _mediator.Send(new GetCurrentUserRequest());
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ChangePasswordResponse>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpGet("exists/{username}")]
    [AllowAnonymous]
    public async Task<ActionResult<bool>> CheckUsernameExists(string username)
    {
        var exists = await _mediator.Send(new CheckUsernameExistsRequest { Username = username });
        return Ok(exists);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<GetUsersResponse>> GetUsers()
    {
        try
        {
            var response = await _mediator.Send(new GetUsersRequest());
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
    }

    [HttpGet("{userId:guid}")]
    [Authorize]
    public async Task<ActionResult<UserDto>> GetUserById(Guid userId)
    {
        try
        {
            var response = await _mediator.Send(new GetUserByIdRequest { UserId = userId });
            if (response == null) return NotFound();
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CreateUserResponse>> CreateUser([FromBody] CreateUserRequest request)
    {
        try
        {
            var response = await _mediator.Send(request);
            return CreatedAtAction(nameof(GetUserById), new { userId = response.UserId }, response);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut]
    [Authorize]
    public async Task<ActionResult<UpdateUserResponse>> UpdateUser([FromBody] UpdateUserRequest request)
    {
        try
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{userId:guid}")]
    [Authorize]
    public async Task<ActionResult<DeleteUserResponse>> DeleteUser(Guid userId)
    {
        try
        {
            var response = await _mediator.Send(new DeleteUserRequest { UserId = userId });
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{userId:guid}/password")]
    [Authorize]
    public async Task<ActionResult<UpdatePasswordResponse>> UpdatePassword(Guid userId, [FromBody] UpdatePasswordRequest request)
    {
        request.UserId = userId;
        try
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
