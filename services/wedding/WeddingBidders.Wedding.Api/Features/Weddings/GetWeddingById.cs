using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Wedding.Core;

namespace WeddingBidders.Wedding.Api.Features.Weddings;

public class GetWeddingByIdRequest : IRequest<WeddingDto?>
{
    public Guid WeddingId { get; set; }
}

public class GetWeddingByIdHandler : IRequestHandler<GetWeddingByIdRequest, WeddingDto?>
{
    private readonly IWeddingContext _context;

    public GetWeddingByIdHandler(IWeddingContext context)
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
