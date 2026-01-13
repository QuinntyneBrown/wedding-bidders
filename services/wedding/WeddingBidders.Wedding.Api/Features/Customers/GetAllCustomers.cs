using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Wedding.Core;

namespace WeddingBidders.Wedding.Api.Features.Customers;

public class GetAllCustomersRequest : IRequest<List<CustomerDto>>
{
}

public class GetAllCustomersHandler : IRequestHandler<GetAllCustomersRequest, List<CustomerDto>>
{
    private readonly IWeddingContext _context;

    public GetAllCustomersHandler(IWeddingContext context)
    {
        _context = context;
    }

    public async Task<List<CustomerDto>> Handle(GetAllCustomersRequest request, CancellationToken cancellationToken)
    {
        var customers = await _context.Customers
            .OrderByDescending(c => c.CreatedDate)
            .ToListAsync(cancellationToken);

        return customers.Select(c => c.ToDto()).ToList();
    }
}
