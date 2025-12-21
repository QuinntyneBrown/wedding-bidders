using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Customers;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Customer)]
public class GetAllCustomersRequest : IRequest<GetAllCustomersResponse>
{
}

public class GetAllCustomersResponse
{
    public List<CustomerDto> Customers { get; set; } = new();
}

public class GetAllCustomersHandler : IRequestHandler<GetAllCustomersRequest, GetAllCustomersResponse>
{
    private readonly IWeddingBiddersContext _context;

    public GetAllCustomersHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<GetAllCustomersResponse> Handle(GetAllCustomersRequest request, CancellationToken cancellationToken)
    {
        var customers = await _context.Customers
            .ToListAsync(cancellationToken);

        return new GetAllCustomersResponse
        {
            Customers = customers.Select(c => c.ToDto()).ToList()
        };
    }
}
