using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using WeddingBidders.Shared.Core.Events;

namespace WeddingBidders.Shared.Messaging;

public class EventBusBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<EventBusBackgroundService> _logger;
    private readonly List<EventSubscription> _subscriptions;

    public EventBusBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<EventBusBackgroundService> logger,
        IEnumerable<EventSubscription> subscriptions)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _subscriptions = subscriptions.ToList();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Event Bus Background Service is starting");

        using var scope = _serviceProvider.CreateScope();
        var eventBus = scope.ServiceProvider.GetRequiredService<IEventBus>();

        foreach (var subscription in _subscriptions)
        {
            await subscription.Subscribe(eventBus, scope.ServiceProvider, stoppingToken);
            _logger.LogInformation("Subscribed to event type {EventType}", subscription.EventType.Name);
        }

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}

public class EventSubscription
{
    public Type EventType { get; }
    public Type HandlerType { get; }

    public EventSubscription(Type eventType, Type handlerType)
    {
        EventType = eventType;
        HandlerType = handlerType;
    }

    public async Task Subscribe(IEventBus eventBus, IServiceProvider serviceProvider, CancellationToken cancellationToken)
    {
        var subscribeMethod = typeof(IEventBus)
            .GetMethod(nameof(IEventBus.SubscribeAsync))!
            .MakeGenericMethod(EventType);

        var handlerInstance = serviceProvider.GetRequiredService(HandlerType);
        var handleMethod = HandlerType.GetMethod("HandleAsync")!;

        var handler = Delegate.CreateDelegate(
            typeof(Func<,>).MakeGenericType(EventType, typeof(Task)),
            handlerInstance,
            handleMethod);

        await (Task)subscribeMethod.Invoke(eventBus, new object[] { handler, cancellationToken })!;
    }
}
