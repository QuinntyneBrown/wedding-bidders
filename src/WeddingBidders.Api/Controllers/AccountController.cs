using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Accounts;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController : ControllerBase
{
    private readonly IMediator _mediator;

    public AccountController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<AccountDto>> GetCurrentAccount()
    {
        var account = await _mediator.Send(new GetCurrentAccountRequest());
        if (account == null)
        {
            return NotFound(new { message = "Account not found" });
        }
        return Ok(account);
    }

    [HttpGet("billing")]
    [Authorize]
    public async Task<ActionResult<BillingDto>> GetBilling()
    {
        var billing = await _mediator.Send(new GetBillingRequest());
        if (billing == null)
        {
            return NotFound(new { message = "Billing information not found" });
        }
        return Ok(billing);
    }
}
