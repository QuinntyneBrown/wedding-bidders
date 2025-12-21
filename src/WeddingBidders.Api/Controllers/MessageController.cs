using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Messages;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/message")]
public class MessageController : ControllerBase
{
    private readonly IMediator _mediator;

    public MessageController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("getByOtherProfileId")]
    [Authorize]
    public async Task<ActionResult<GetMessagesByOtherProfileIdResponse>> GetMessagesByOtherProfileId([FromQuery] Guid otherProfileId)
    {
        var response = await _mediator.Send(new GetMessagesByOtherProfileIdRequest { OtherProfileId = otherProfileId });
        return Ok(response.Messages);
    }

    [HttpPost("add")]
    [Authorize]
    public async Task<ActionResult<MessageDto>> SendMessage([FromBody] SendMessageRequest request)
    {
        try
        {
            var message = await _mediator.Send(request);
            return Ok(message);
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
}

[ApiController]
[Route("api/conversation")]
public class ConversationController : ControllerBase
{
    private readonly IMediator _mediator;

    public ConversationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("getAll")]
    [Authorize]
    public async Task<ActionResult<GetAllConversationsResponse>> GetAllConversations()
    {
        try
        {
            var response = await _mediator.Send(new GetAllConversationsRequest());
            return Ok(response.Conversations);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
