using MessagePack;

namespace WeddingBidders.Shared.Core.Events;

[MessagePackObject]
public class UserCreatedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid UserId { get; set; }

    [Key(4)]
    public string Username { get; set; } = string.Empty;
}

[MessagePackObject]
public class UserDeletedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid UserId { get; set; }
}

[MessagePackObject]
public class ProfileCreatedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid ProfileId { get; set; }

    [Key(4)]
    public Guid UserId { get; set; }

    [Key(5)]
    public string ProfileType { get; set; } = string.Empty;
}
