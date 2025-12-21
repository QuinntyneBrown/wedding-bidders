using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Customers;

public class GetCurrentCustomerRequest : IRequest<CustomerDto?>
{
}

public class GetCurrentCustomerHandler : IRequestHandler<GetCurrentCustomerRequest, CustomerDto?>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCurrentCustomerHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CustomerDto?> Handle(GetCurrentCustomerRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return null;
        }

        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Email.ToLower() == username.ToLower(), cancellationToken);

        return customer?.ToDto();
    }
}
