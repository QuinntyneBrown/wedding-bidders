using Microsoft.EntityFrameworkCore;
using WeddingBidders.Wedding.Core;

namespace WeddingBidders.Wedding.Infrastructure.Seeding;

public class WeddingSeedingService
{
    private readonly IWeddingContext _context;

    public WeddingSeedingService(IWeddingContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        await SeedCategoriesAsync();
        await _context.SaveChangesAsync();
    }

    private async Task SeedCategoriesAsync()
    {
        // Categories are created per wedding, no global seeding needed
        // This method is here for future seeding needs
        await Task.CompletedTask;
    }
}
