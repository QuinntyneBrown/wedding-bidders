using Common.Data.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Data.Contracts
{
    public interface IWeddingBiddersUow
    {
        IRepository<User> Users { get; }
        IRepository<Account> Accounts { get; }
        IRepository<Profile> Profiles { get; }
        IRepository<Role> Roles { get;}        
        IRepository<Group> Groups { get; }
        IRepository<Session> Sessions { get; }
        IRepository<Customer> Customers { get; }
        IRepository<Caterer> Caterers { get; }
        IRepository<Photo> Photos { get; }
        IRepository<Gallery> Galleries { get; }
        IRepository<Wedding> Weddings { get; }
        IRepository<Bid> Bids { get; }
        IRepository<Bidder> Bidders { get; }
        IRepository<Message> Messages { get; }
        IRepository<HtmlContent> HtmlContents { get; }        
        IRepository<Page> Pages { get; }
        IRepository<MakeUpArtist> MakeUpArtists { get; }
        IRepository<EventPlanner> EventPlanners { get; }
        IRepository<Photographer> Photographers { get; }
        IRepository<Conversation> Conversations { get; }
        IRepository<Issue> Issues { get; }
        IRepository<DiscJockey> DiscJockeys { get; }

        void SaveChanges();
    }
}
