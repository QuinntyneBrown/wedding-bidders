using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Wedding.Core;

namespace WeddingBidders.Wedding.Api.Features.Weddings;

public class GetAllWeddingsRequest : IRequest<List<WeddingDto>>
{
}

public class GetAllWeddingsHandler : IRequestHandler<GetAllWeddingsRequest, List<WeddingDto>>
{
    private readonly IWeddingContext _context;

    public GetAllWeddingsHandler(IWeddingContext context)
    {
        _context = context;
    }

    public async Task<List<WeddingDto>> Handle(GetAllWeddingsRequest request, CancellationToken cancellationToken)
    {
        var weddings = await _context.Weddings
            .Include(w => w.Categories)
            .OrderByDescending(w => w.CreatedDate)
            .ToListAsync(cancellationToken);

        return weddings.Select(w => w.ToDto()).ToList();
    }
}
