using System.Linq;
using System.Net.Http;
using System.Data.Entity;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class ProfileService : IProfileService
    {
        protected readonly IWeddingBiddersUow uow;

        public ProfileService(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        public dynamic GetCurrentProfile(HttpRequestMessage request)
        {
            var username = request.GetRequestContext().Principal.Identity.Name;

            var user = uow.Users.GetAll()
                .Include(x => x.Accounts)
                .Include("Accounts.Profiles")
                .Single(x => x.Username == username);

            var account = user.Accounts.First();
            var profile = account.Profiles.First();
            return new
            {
                Firstname = account.Firstname,
                Lastname = account.Lastname,
                Email = account.Email,
                ProfileType = profile.ProfileType,
                Id = profile.Id
            };
        }

    }
}