using WeddingBidders.Bidding.Core;

namespace WeddingBidders.Bidding.Infrastructure.Seeding;

public class BiddingSeedingService
{
    private readonly IBiddingContext _context;

    public BiddingSeedingService(IBiddingContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        // Bidders are registered through the API, no global seeding needed
        await Task.CompletedTask;
    }
}
