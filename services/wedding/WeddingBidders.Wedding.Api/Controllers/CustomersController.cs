using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Wedding.Api.Features.Customers;

namespace WeddingBidders.Wedding.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<ActionResult<CustomerDto>> RegisterCustomer([FromBody] RegisterCustomerRequest request)
    {
        try
        {
            var customer = await _mediator.Send(request);
            return CreatedAtAction(nameof(GetAllCustomers), customer);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<CustomerDto>>> GetAllCustomers()
    {
        var customers = await _mediator.Send(new GetAllCustomersRequest());
        return Ok(customers);
    }
}
