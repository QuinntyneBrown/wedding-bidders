using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using WeddingBidders.Shared.Core.Events;

namespace WeddingBidders.Shared.Messaging;

public class RedisEventBus : IEventBus, IDisposable
{
    private readonly IConnectionMultiplexer _redis;
    private readonly ISubscriber _subscriber;
    private readonly ILogger<RedisEventBus> _logger;
    private readonly Dictionary<Type, List<Delegate>> _handlers = new();
    private readonly SemaphoreSlim _lock = new(1, 1);

    public RedisEventBus(IConnectionMultiplexer redis, ILogger<RedisEventBus> logger)
    {
        _redis = redis;
        _subscriber = redis.GetSubscriber();
        _logger = logger;
    }

    public async Task PublishAsync<T>(T @event, CancellationToken cancellationToken = default) where T : IntegrationEvent
    {
        var channel = GetChannelName<T>();
        var data = EventSerializer.Serialize(@event);

        _logger.LogInformation(
            "Publishing event {EventType} with ID {EventId} to channel {Channel}",
            @event.EventType,
            @event.EventId,
            channel);

        await _subscriber.PublishAsync(RedisChannel.Literal(channel), data);
    }

    public async Task SubscribeAsync<T>(Func<T, Task> handler, CancellationToken cancellationToken = default) where T : IntegrationEvent
    {
        var channel = GetChannelName<T>();
        var eventType = typeof(T);

        await _lock.WaitAsync(cancellationToken);
        try
        {
            if (!_handlers.ContainsKey(eventType))
            {
                _handlers[eventType] = new List<Delegate>();

                await _subscriber.SubscribeAsync(RedisChannel.Literal(channel), async (ch, message) =>
                {
                    try
                    {
                        if (message.HasValue)
                        {
                            var @event = EventSerializer.Deserialize<T>((byte[])message!);

                            _logger.LogInformation(
                                "Received event {EventType} with ID {EventId} from channel {Channel}",
                                @event.EventType,
                                @event.EventId,
                                channel);

                            if (_handlers.TryGetValue(eventType, out var handlers))
                            {
                                foreach (var h in handlers.Cast<Func<T, Task>>())
                                {
                                    await h(@event);
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error processing event from channel {Channel}", channel);
                    }
                });
            }

            _handlers[eventType].Add(handler);
        }
        finally
        {
            _lock.Release();
        }

        _logger.LogInformation("Subscribed to channel {Channel} for event type {EventType}", channel, eventType.Name);
    }

    private static string GetChannelName<T>() where T : IntegrationEvent
    {
        return $"wedding-bidders:{typeof(T).Name}";
    }

    public void Dispose()
    {
        _lock.Dispose();
    }
}
