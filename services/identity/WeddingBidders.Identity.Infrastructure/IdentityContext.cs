using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;
using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Infrastructure;

public class IdentityContext : DbContext, IIdentityContext
{
    public IdentityContext(DbContextOptions<IdentityContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Privilege> Privileges => Set<Privilege>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<InvitationToken> InvitationTokens => Set<InvitationToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(IdentityContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
