using MessagePack;
using MessagePack.Resolvers;
using WeddingBidders.Shared.Core.Events;

namespace WeddingBidders.Shared.Messaging;

public static class EventSerializer
{
    private static readonly MessagePackSerializerOptions Options = MessagePackSerializerOptions.Standard
        .WithResolver(CompositeResolver.Create(
            StandardResolver.Instance,
            ContractlessStandardResolver.Instance
        ))
        .WithCompression(MessagePackCompression.Lz4BlockArray);

    public static byte[] Serialize<T>(T @event) where T : IntegrationEvent
    {
        return MessagePackSerializer.Serialize(@event, Options);
    }

    public static T Deserialize<T>(byte[] data) where T : IntegrationEvent
    {
        return MessagePackSerializer.Deserialize<T>(data, Options);
    }

    public static object Deserialize(byte[] data, Type type)
    {
        return MessagePackSerializer.Deserialize(type, data, Options);
    }
}
