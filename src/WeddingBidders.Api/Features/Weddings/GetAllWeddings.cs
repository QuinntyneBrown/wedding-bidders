using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Weddings;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Wedding)]
public class GetAllWeddingsRequest : IRequest<GetAllWeddingsResponse>
{
}

public class GetAllWeddingsResponse
{
    public List<WeddingDto> Weddings { get; set; } = new();
}

public class GetAllWeddingsHandler : IRequestHandler<GetAllWeddingsRequest, GetAllWeddingsResponse>
{
    private readonly IWeddingBiddersContext _context;

    public GetAllWeddingsHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<GetAllWeddingsResponse> Handle(GetAllWeddingsRequest request, CancellationToken cancellationToken)
    {
        var weddings = await _context.Weddings
            .Include(w => w.Categories)
            .OrderBy(w => w.Date)
            .ToListAsync(cancellationToken);

        return new GetAllWeddingsResponse
        {
            Weddings = weddings.Select(w => w.ToDto()).ToList()
        };
    }
}
