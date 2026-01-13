using Microsoft.EntityFrameworkCore;
using WeddingBidders.Bidding.Core;
using WeddingBidders.Bidding.Core.Model;

namespace WeddingBidders.Bidding.Infrastructure;

public class BiddingContext : DbContext, IBiddingContext
{
    public BiddingContext(DbContextOptions<BiddingContext> options) : base(options)
    {
    }

    public DbSet<Bidder> Bidders => Set<Bidder>();
    public DbSet<Bid> Bids => Set<Bid>();
    public DbSet<Gallery> Galleries => Set<Gallery>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BiddingContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
