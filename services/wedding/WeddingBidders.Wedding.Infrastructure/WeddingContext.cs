using Microsoft.EntityFrameworkCore;
using WeddingBidders.Wedding.Core;
using WeddingBidders.Wedding.Core.Model;

namespace WeddingBidders.Wedding.Infrastructure;

public class WeddingContext : DbContext, IWeddingContext
{
    public WeddingContext(DbContextOptions<WeddingContext> options) : base(options)
    {
    }

    public DbSet<Core.Model.Wedding> Weddings => Set<Core.Model.Wedding>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WeddingContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
