using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.AccountAggregate;
using WeddingBidders.Core.Model.BidAggregate;
using WeddingBidders.Core.Model.BidderAggregate;
using WeddingBidders.Core.Model.CustomerAggregate;
using WeddingBidders.Core.Model.InvitationTokenAggregate;
using WeddingBidders.Core.Model.IssueAggregate;
using WeddingBidders.Core.Model.MessageAggregate;
using WeddingBidders.Core.Model.ProfileAggregate;
using WeddingBidders.Core.Model.SubscriptionAggregate;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Model.WeddingAggregate;

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
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Bidder> Bidders => Set<Bidder>();
    public DbSet<Gallery> Galleries => Set<Gallery>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Wedding> Weddings => Set<Wedding>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Bid> Bids => Set<Bid>();
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Issue> Issues => Set<Issue>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Plan> Plans => Set<Plan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(WeddingBiddersContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
