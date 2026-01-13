using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Wedding.Core;

namespace WeddingBidders.Wedding.Api.Features.Weddings;

public class GetWeddingsByCustomerIdRequest : IRequest<List<WeddingDto>>
{
    public Guid CustomerId { get; set; }
}

public class GetWeddingsByCustomerIdHandler : IRequestHandler<GetWeddingsByCustomerIdRequest, List<WeddingDto>>
{
    private readonly IWeddingContext _context;

    public GetWeddingsByCustomerIdHandler(IWeddingContext context)
    {
        _context = context;
    }

    public async Task<List<WeddingDto>> Handle(GetWeddingsByCustomerIdRequest request, CancellationToken cancellationToken)
    {
        var weddings = await _context.Weddings
            .Include(w => w.Categories)
            .Where(w => w.CustomerId == request.CustomerId)
            .OrderByDescending(w => w.CreatedDate)
            .ToListAsync(cancellationToken);

        return weddings.Select(w => w.ToDto()).ToList();
    }
}
