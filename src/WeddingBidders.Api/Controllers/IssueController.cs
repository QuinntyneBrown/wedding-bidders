using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Issues;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/issue")]
public class IssueController : ControllerBase
{
    private readonly IMediator _mediator;

    public IssueController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("getAll")]
    [Authorize]
    public async Task<ActionResult<GetAllIssuesResponse>> GetAllIssues()
    {
        try
        {
            var response = await _mediator.Send(new GetAllIssuesRequest());
            return Ok(response.Issues);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost("add")]
    [Authorize]
    public async Task<ActionResult<IssueDto>> CreateIssue([FromBody] CreateIssueRequest request)
    {
        try
        {
            var issue = await _mediator.Send(request);
            return Ok(issue);
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
