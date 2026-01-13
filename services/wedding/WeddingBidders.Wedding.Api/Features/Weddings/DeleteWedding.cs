using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;
using WeddingBidders.Wedding.Core;

namespace WeddingBidders.Wedding.Api.Features.Weddings;

public class DeleteWeddingRequest : IRequest<bool>
{
    public Guid WeddingId { get; set; }
}

public class DeleteWeddingHandler : IRequestHandler<DeleteWeddingRequest, bool>
{
    private readonly IWeddingContext _context;
    private readonly IEventBus _eventBus;

    public DeleteWeddingHandler(IWeddingContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<bool> Handle(DeleteWeddingRequest request, CancellationToken cancellationToken)
    {
        var wedding = await _context.Weddings
            .FirstOrDefaultAsync(w => w.WeddingId == request.WeddingId, cancellationToken);

        if (wedding == null)
        {
            return false;
        }

        wedding.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new WeddingDeletedEvent
        {
            WeddingId = wedding.WeddingId
        }, cancellationToken);

        return true;
    }
}
