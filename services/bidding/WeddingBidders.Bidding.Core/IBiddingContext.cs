using Microsoft.EntityFrameworkCore;
using WeddingBidders.Bidding.Core.Model;

namespace WeddingBidders.Bidding.Core;

public interface IBiddingContext
{
    DbSet<Bidder> Bidders { get; }
    DbSet<Bid> Bids { get; }
    DbSet<Gallery> Galleries { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
