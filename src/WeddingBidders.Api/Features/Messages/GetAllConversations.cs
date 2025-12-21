using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Messages;

[AuthorizeResourceOperation(Operations.Read, AggregateNames.Conversation)]
public class GetAllConversationsRequest : IRequest<GetAllConversationsResponse>
{
}

public class GetAllConversationsResponse
{
    public List<ConversationDto> Conversations { get; set; } = new();
}

public class GetAllConversationsHandler : IRequestHandler<GetAllConversationsRequest, GetAllConversationsResponse>
{
    private readonly IWeddingBiddersContext _context;

    public GetAllConversationsHandler(IWeddingBiddersContext context)
    {
        _context = context;
    }

    public async Task<GetAllConversationsResponse> Handle(GetAllConversationsRequest request, CancellationToken cancellationToken)
    {
        var conversations = await _context.Conversations
            .Include(c => c.Messages)
            .Include(c => c.Profiles)
            .ToListAsync(cancellationToken);

        return new GetAllConversationsResponse
        {
            Conversations = conversations.Select(c => new ConversationDto
            {
                ConversationId = c.ConversationId,
                Messages = c.Messages.Select(m => m.ToDto()).ToList(),
                Profiles = c.Profiles.Select(p => new ProfileSummaryDto
                {
                    ProfileId = p.ProfileId,
                    Firstname = p.Firstname,
                    Lastname = p.Lastname
                }).ToList()
            }).ToList()
        };
    }
}
