using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Support.Api.Features.Issues;

namespace WeddingBidders.Support.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class IssuesController : ControllerBase
{
    private readonly IMediator _mediator;

    public IssuesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<IssueDto>> CreateIssue([FromBody] CreateIssueRequest request)
    {
        var issue = await _mediator.Send(request);
        return CreatedAtAction(nameof(GetAllIssues), issue);
    }

    [HttpGet]
    public async Task<ActionResult<List<IssueDto>>> GetAllIssues()
    {
        var issues = await _mediator.Send(new GetAllIssuesRequest());
        return Ok(issues);
    }
}
