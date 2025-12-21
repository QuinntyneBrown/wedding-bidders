using Microsoft.EntityFrameworkCore;
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

namespace WeddingBidders.Core;

public interface IWeddingBiddersContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<Privilege> Privileges { get; }
    DbSet<Profile> Profiles { get; }
    DbSet<InvitationToken> InvitationTokens { get; }
    DbSet<Account> Accounts { get; }
    DbSet<Bidder> Bidders { get; }
    DbSet<Gallery> Galleries { get; }
    DbSet<Customer> Customers { get; }
    DbSet<Wedding> Weddings { get; }
    DbSet<Category> Categories { get; }
    DbSet<Bid> Bids { get; }
    DbSet<Conversation> Conversations { get; }
    DbSet<Message> Messages { get; }
    DbSet<Issue> Issues { get; }
    DbSet<Subscription> Subscriptions { get; }
    DbSet<Payment> Payments { get; }
    DbSet<Plan> Plans { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
