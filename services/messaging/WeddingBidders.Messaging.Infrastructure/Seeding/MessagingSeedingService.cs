using WeddingBidders.Messaging.Core;

namespace WeddingBidders.Messaging.Infrastructure.Seeding;

public class MessagingSeedingService
{
    private readonly IMessagingContext _context;

    public MessagingSeedingService(IMessagingContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        // Messages are created through the API, no seeding needed
        await Task.CompletedTask;
    }
}
