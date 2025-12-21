using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.MessageAggregate;

namespace WeddingBidders.Api.Features.Messages;

public class SendMessageRequest : IRequest<MessageDto>
{
    public Guid OtherProfileId { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class SendMessageRequestValidator : AbstractValidator<SendMessageRequest>
{
    public SendMessageRequestValidator()
    {
        RuleFor(x => x.OtherProfileId).NotEmpty();
        RuleFor(x => x.Content).NotEmpty().MaximumLength(4000);
    }
}

public class SendMessageHandler : IRequestHandler<SendMessageRequest, MessageDto>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SendMessageHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<MessageDto> Handle(SendMessageRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }

        var user = await _context.Users
            .Include(u => u.Profiles)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower(), cancellationToken);

        if (user == null)
        {
            throw new InvalidOperationException("User not found");
        }

        var currentProfile = user.Profiles.FirstOrDefault();
        if (currentProfile == null)
        {
            throw new InvalidOperationException("Profile not found");
        }

        var otherProfile = await _context.Profiles
            .FirstOrDefaultAsync(p => p.ProfileId == request.OtherProfileId, cancellationToken);

        if (otherProfile == null)
        {
            throw new InvalidOperationException("Recipient profile not found");
        }

        var conversation = await _context.Conversations
            .Include(c => c.Profiles)
            .Include(c => c.Messages)
            .Where(c => c.Profiles.Any(p => p.ProfileId == currentProfile.ProfileId))
            .Where(c => c.Profiles.Any(p => p.ProfileId == request.OtherProfileId))
            .FirstOrDefaultAsync(cancellationToken);

        if (conversation == null)
        {
            conversation = new Conversation
            {
                ConversationId = Guid.NewGuid(),
                CreatedDate = DateTime.UtcNow
            };
            conversation.Profiles.Add(currentProfile);
            conversation.Profiles.Add(otherProfile);
            _context.Conversations.Add(conversation);
        }

        var message = new Message
        {
            MessageId = Guid.NewGuid(),
            ConversationId = conversation.ConversationId,
            FromProfileId = currentProfile.ProfileId,
            ToProfileId = request.OtherProfileId,
            Content = request.Content,
            IsRead = false,
            CreatedDate = DateTime.UtcNow
        };

        conversation.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);

        return message.ToDto();
    }
}
