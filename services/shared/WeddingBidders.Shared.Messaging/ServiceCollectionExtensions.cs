using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using WeddingBidders.Shared.Core.Events;

namespace WeddingBidders.Shared.Messaging;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRedisEventBus(this IServiceCollection services, string connectionString)
    {
        services.AddSingleton<IConnectionMultiplexer>(sp =>
            ConnectionMultiplexer.Connect(connectionString));

        services.AddSingleton<IEventBus, RedisEventBus>();

        return services;
    }

    public static IServiceCollection AddEventHandler<TEvent, THandler>(this IServiceCollection services)
        where TEvent : IntegrationEvent
        where THandler : class, IEventHandler<TEvent>
    {
        services.AddScoped<THandler>();
        services.AddSingleton(new EventSubscription(typeof(TEvent), typeof(THandler)));

        return services;
    }

    public static IServiceCollection AddEventBusBackgroundService(this IServiceCollection services)
    {
        services.AddHostedService<EventBusBackgroundService>();
        return services;
    }
}
