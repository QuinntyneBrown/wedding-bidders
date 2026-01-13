using WeddingBidders.Support.Core;

namespace WeddingBidders.Support.Infrastructure.Seeding;

public class SupportSeedingService
{
    private readonly ISupportContext _context;

    public SupportSeedingService(ISupportContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        // Issues are created through the API, no seeding needed
        await Task.CompletedTask;
    }
}
