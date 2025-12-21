using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Weddings;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Wedding)]
public class GetWeddingByIdRequest : IRequest<WeddingDto?>
{
    public Guid WeddingId { get; set; }
}

public class GetWeddingByIdHandler : IRequestHandler<GetWeddingByIdRequest, WeddingDto?>
{
    private readonly IWeddingBiddersContext _context;

    public GetWeddingByIdHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<WeddingDto?> Handle(GetWeddingByIdRequest request, CancellationToken cancellationToken)
    {
        var wedding = await _context.Weddings
            .Include(w => w.Categories)
            .FirstOrDefaultAsync(w => w.WeddingId == request.WeddingId, cancellationToken);

        return wedding?.ToDto();
    }
}
