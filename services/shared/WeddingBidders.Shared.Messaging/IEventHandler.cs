using WeddingBidders.Shared.Core.Events;

namespace WeddingBidders.Shared.Messaging;

public interface IEventHandler<in TEvent> where TEvent : IntegrationEvent
{
    Task HandleAsync(TEvent @event, CancellationToken cancellationToken = default);
}
