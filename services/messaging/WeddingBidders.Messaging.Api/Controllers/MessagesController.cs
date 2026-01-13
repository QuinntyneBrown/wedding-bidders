using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Messaging.Api.Features.Messages;

namespace WeddingBidders.Messaging.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMediator _mediator;

    public MessagesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> SendMessage([FromBody] SendMessageRequest request)
    {
        var message = await _mediator.Send(request);
        return CreatedAtAction(nameof(GetConversations), message);
    }

    [HttpGet("conversations/{profileId:guid}")]
    public async Task<ActionResult<List<ConversationDto>>> GetConversations(Guid profileId)
    {
        var conversations = await _mediator.Send(new GetConversationsRequest { ProfileId = profileId });
        return Ok(conversations);
    }
}
