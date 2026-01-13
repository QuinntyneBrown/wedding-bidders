using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Messaging.Core;
using WeddingBidders.Messaging.Core.Model;
using WeddingBidders.Shared.Core.Events;
using WeddingBidders.Shared.Messaging;

namespace WeddingBidders.Messaging.Api.Features.Messages;

public class SendMessageRequest : IRequest<MessageDto>
{
    public Guid FromProfileId { get; set; }
    public Guid ToProfileId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Subject { get; set; }
}

public class SendMessageRequestValidator : AbstractValidator<SendMessageRequest>
{
    public SendMessageRequestValidator()
    {
        RuleFor(x => x.FromProfileId).NotEmpty();
        RuleFor(x => x.ToProfileId).NotEmpty();
        RuleFor(x => x.Content).NotEmpty();
    }
}

public class SendMessageHandler : IRequestHandler<SendMessageRequest, MessageDto>
{
    private readonly IMessagingContext _context;
    private readonly IEventBus _eventBus;

    public SendMessageHandler(IMessagingContext context, IEventBus eventBus)
    {
        _context = context;
        _eventBus = eventBus;
    }

    public async Task<MessageDto> Handle(SendMessageRequest request, CancellationToken cancellationToken)
    {
        // Find or create conversation
        var conversation = await _context.Conversations
            .Include(c => c.Profiles)
            .FirstOrDefaultAsync(c =>
                c.Profiles.Any(p => p.ProfileId == request.FromProfileId) &&
                c.Profiles.Any(p => p.ProfileId == request.ToProfileId),
                cancellationToken);

        if (conversation == null)
        {
            conversation = new Conversation
            {
                ConversationId = Guid.NewGuid(),
                CreatedDate = DateTime.UtcNow,
                Profiles = new List<ConversationProfile>
                {
                    new() { ProfileId = request.FromProfileId },
                    new() { ProfileId = request.ToProfileId }
                }
            };
            _context.Conversations.Add(conversation);

            await _eventBus.PublishAsync(new ConversationCreatedEvent
            {
                ConversationId = conversation.ConversationId,
                ProfileIds = new List<Guid> { request.FromProfileId, request.ToProfileId }
            }, cancellationToken);
        }

        var message = new Message
        {
            MessageId = Guid.NewGuid(),
            ConversationId = conversation.ConversationId,
            FromProfileId = request.FromProfileId,
            ToProfileId = request.ToProfileId,
            Content = request.Content,
            Subject = request.Subject,
            IsRead = false,
            CreatedDate = DateTime.UtcNow
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync(cancellationToken);

        await _eventBus.PublishAsync(new MessageSentEvent
        {
            MessageId = message.MessageId,
            ConversationId = conversation.ConversationId,
            FromProfileId = message.FromProfileId,
            ToProfileId = message.ToProfileId,
            Content = message.Content
        }, cancellationToken);

        return message.ToDto();
    }
}
