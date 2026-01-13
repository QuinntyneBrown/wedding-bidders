using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Identity.Api.Features.Accounts;

namespace WeddingBidders.Identity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AccountsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("current")]
    public async Task<ActionResult<AccountDto>> GetCurrentAccount()
    {
        var account = await _mediator.Send(new GetCurrentAccountRequest());
        if (account == null)
        {
            return NotFound();
        }
        return Ok(account);
    }
}
