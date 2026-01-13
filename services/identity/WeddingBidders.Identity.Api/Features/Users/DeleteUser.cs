using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;

namespace WeddingBidders.Identity.Api.Features.Users;

public class DeleteUserRequest : IRequest<bool>
{
    public Guid UserId { get; set; }
}

public class DeleteUserHandler : IRequestHandler<DeleteUserRequest, bool>
{
    private readonly IIdentityContext _context;
    private readonly IEventBus _eventBus;

    public DeleteUserHandler(IIdentityContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<bool> Handle(DeleteUserRequest request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == request.UserId, cancellationToken);

        if (user == null)
        {
            return false;
        }

        user.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new UserDeletedEvent
        {
            UserId = user.UserId
        }, cancellationToken);

        return true;
    }
}
