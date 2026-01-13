using MessagePack;

namespace WeddingBidders.Shared.Core.Events;

[MessagePackObject]
public class WeddingCreatedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid WeddingId { get; set; }

    [Key(4)]
    public Guid CustomerId { get; set; }

    [Key(5)]
    public string Location { get; set; } = string.Empty;

    [Key(6)]
    public DateTime WeddingDate { get; set; }

    [Key(7)]
    public int NumberOfGuests { get; set; }
}

[MessagePackObject]
public class WeddingUpdatedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid WeddingId { get; set; }

    [Key(4)]
    public string Location { get; set; } = string.Empty;

    [Key(5)]
    public DateTime WeddingDate { get; set; }

    [Key(6)]
    public int NumberOfGuests { get; set; }
}

[MessagePackObject]
public class WeddingDeletedEvent : IntegrationEvent
{
    [Key(3)]
    public Guid WeddingId { get; set; }
}

[MessagePackObject]
public class CustomerRegisteredEvent : IntegrationEvent
{
    [Key(3)]
    public Guid CustomerId { get; set; }

    [Key(4)]
    public Guid ProfileId { get; set; }

    [Key(5)]
    public string Email { get; set; } = string.Empty;

    [Key(6)]
    public string FirstName { get; set; } = string.Empty;

    [Key(7)]
    public string LastName { get; set; } = string.Empty;
}
