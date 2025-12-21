using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.InvitationTokenAggregate;
using WeddingBidders.Core.Model.ProfileAggregate;
using WeddingBidders.Core.Model.UserAggregate;

namespace WeddingBidders.Infrastructure;

public class WeddingBiddersContext : DbContext, IWeddingBiddersContext
{
    public WeddingBiddersContext(DbContextOptions<WeddingBiddersContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Privilege> Privileges => Set<Privilege>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<InvitationToken> InvitationTokens => Set<InvitationToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WeddingBiddersContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
