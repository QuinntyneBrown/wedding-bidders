using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Weddings;

[AuthorizeResourceOperation(Operations.Delete, AggregateNames.Wedding)]
public class DeleteWeddingRequest : IRequest<bool>
{
    public Guid WeddingId { get; set; }
}

public class DeleteWeddingHandler : IRequestHandler<DeleteWeddingRequest, bool>
{
    private readonly IWeddingBiddersContext _context;

    public DeleteWeddingHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteWeddingRequest request, CancellationToken cancellationToken)
    {
        var wedding = await _context.Weddings
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(w => w.WeddingId == request.WeddingId, cancellationToken);

        if (wedding == null)
        {
            return false;
        }

        wedding.IsDeleted = true;
        wedding.LastModifiedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
