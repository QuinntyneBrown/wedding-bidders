using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Messaging.Core;

namespace WeddingBidders.Messaging.Api.Features.Messages;

public class GetConversationsRequest : IRequest<List<ConversationDto>>
{
    public Guid ProfileId { get; set; }
}

public class GetConversationsHandler : IRequestHandler<GetConversationsRequest, List<ConversationDto>>
{
    private readonly IMessagingContext _context;

    public GetConversationsHandler(IMessagingContext context)
    {
        _context = context;
    }

    public async Task<List<ConversationDto>> Handle(GetConversationsRequest request, CancellationToken cancellationToken)
    {
        var conversations = await _context.Conversations
            .Include(c => c.Profiles)
            .Include(c => c.Messages.OrderByDescending(m => m.CreatedDate).Take(10))
            .Where(c => c.Profiles.Any(p => p.ProfileId == request.ProfileId))
            .ToListAsync(cancellationToken);

        return conversations.Select(c => c.ToDto()).ToList();
    }
}
