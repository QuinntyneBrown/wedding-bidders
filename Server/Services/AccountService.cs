using System;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using WeddingBidders.Server.Config.Contracts;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class AccountService : IAccountService
    {
        public AccountService(IWeddingBiddersUow uow, IConfigurationProvider configurationProvider)
        {
            this.uow = uow;
            this.stripeConfiguration = configurationProvider.Get<IStripeConfiguration>();
        }

        public dynamic GetCurrentAccount(HttpRequestMessage request)
        {
            var username = request.GetRequestContext().Principal.Identity.Name;
            var user = uow.Users.GetAll()
                .Include(x => x.Accounts)
                .Single(x => x.Username == username);

            var account = user.Accounts.First();
            return new AccountDto(account);
        }

        public dynamic GetBilling(HttpRequestMessage request)
        {
            throw new NotImplementedException();
        }

        protected readonly IWeddingBiddersUow uow;

        protected readonly IStripeConfiguration stripeConfiguration;
    }
}