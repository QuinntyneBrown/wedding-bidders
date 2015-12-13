using Common.Data;
using Common.Data.Contracts;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Data
{
    public class WeddingBiddersUow : Common.Data.BaseUow, IWeddingBiddersUow
    {
        public WeddingBiddersUow(WeddingBiddersContext weddingBiddersContext)
            : base(weddingBiddersContext)
        {
            
        }

        public IRepository<User> Users { get { return GetStandardRepo<User>(); } }

        public IRepository<Account> Accounts { get { return GetStandardRepo<Account>(); } }

        public IRepository<Profile> Profiles { get { return GetStandardRepo<Profile>(); } }
        
        public IRepository<Role> Roles { get { return GetStandardRepo<Role>(); } }

        public IRepository<Group> Groups { get { return GetStandardRepo<Group>(); } }

        public IRepository<Session> Sessions { get { return GetStandardRepo<Session>(); } }

        public IRepository<Customer> Customers { get { return GetStandardRepo<Customer>(); } }

        public IRepository<Caterer> Caterers { get { return GetStandardRepo<Caterer>(); } }

        public IRepository<Photo> Photos { get { return GetStandardRepo<Photo>(); } }

        public IRepository<Gallery> Galleries { get { return GetStandardRepo<Gallery>(); } }

        public IRepository<Wedding> Weddings { get { return GetStandardRepo<Wedding>(); } }

        public IRepository<Bid> Bids { get { return GetStandardRepo<Bid>(); } }

        public IRepository<Bidder> Bidders { get { return GetStandardRepo<Bidder>(); } }

        public IRepository<Message> Messages { get { return GetStandardRepo<Message>(); } }

        public IRepository<Page> Pages { get { return GetStandardRepo<Page>(); } }

        public IRepository<HtmlContent> HtmlContents { get { return GetStandardRepo<HtmlContent>(); } }

        public void SaveChanges()
        {
            base.dbContext.SaveChanges();
        }

    }
}
