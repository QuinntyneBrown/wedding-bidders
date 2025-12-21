using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Weddings;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Wedding)]
public class GetWeddingsByCustomerIdRequest : IRequest<GetWeddingsByCustomerIdResponse>
{
    public Guid CustomerId { get; set; }
}

public class GetWeddingsByCustomerIdResponse
{
    public List<WeddingDto> Weddings { get; set; } = new();
}

public class GetWeddingsByCustomerIdHandler : IRequestHandler<GetWeddingsByCustomerIdRequest, GetWeddingsByCustomerIdResponse>
{
    private readonly IWeddingBiddersContext _context;

    public GetWeddingsByCustomerIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<GetWeddingsByCustomerIdResponse> Handle(GetWeddingsByCustomerIdRequest request, CancellationToken cancellationToken)
    {
        var weddings = await _context.Weddings
            .Include(w => w.Categories)
            .Where(w => w.CustomerId == request.CustomerId)
            .ToListAsync(cancellationToken);

        return new GetWeddingsByCustomerIdResponse
        {
            Weddings = weddings.Select(w => w.ToDto()).ToList()
        };
    }
}
