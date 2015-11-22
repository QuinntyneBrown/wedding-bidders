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

        public IRepository<Account> Account { get { return GetStandardRepo<Account>(); } }

        public IRepository<Role> Roles { get { return GetStandardRepo<Role>(); } }

        public IRepository<Group> Groups { get { return GetStandardRepo<Group>(); } }

        public IRepository<Session> Sessions { get { return GetStandardRepo<Session>(); } }

        public IRepository<Customer> Customers { get { return GetStandardRepo<Customer>(); } }

        public IRepository<Caterer> Caterers { get { return GetStandardRepo<Caterer>(); } }

        public IRepository<Photo> Photos { get { return GetStandardRepo<Photo>(); } }

        public IRepository<Gallery> Galleries { get { return GetStandardRepo<Gallery>(); } }

        public void SaveChanges()
        {
            
        }

    }
}
