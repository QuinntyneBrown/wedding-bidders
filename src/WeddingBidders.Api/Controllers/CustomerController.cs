using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeddingBidders.Api.Features.Customers;

namespace WeddingBidders.Api.Controllers;

[ApiController]
[Route("api/customer")]
public class CustomerController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomerController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("current")]
    [Authorize]
    public async Task<ActionResult<CustomerDto>> GetCurrentCustomer()
    {
        var customer = await _mediator.Send(new GetCurrentCustomerRequest());
        if (customer == null)
        {
            return NotFound(new { message = "Customer not found for current user" });
        }
        return Ok(customer);
    }

    [HttpGet("getAll")]
    [Authorize]
    public async Task<ActionResult<GetAllCustomersResponse>> GetAllCustomers()
    {
        try
        {
            var response = await _mediator.Send(new GetAllCustomersRequest());
            return Ok(response.Customers);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost("add")]
    [AllowAnonymous]
    public async Task<ActionResult<RegisterCustomerResponse>> RegisterCustomer([FromBody] RegisterCustomerRequest request)
    {
        var response = await _mediator.Send(request);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }
}
