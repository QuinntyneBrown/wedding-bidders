using System;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        public SubscriptionService(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        public void Charge(HttpRequestMessage request, SubscriptionChargeDto subscriptionChargeDto)
        {
            var username = request.GetRequestContext().Principal.Identity.Name;
            var user = uow.Users.GetAll()
                .Include(x => x.Accounts)
                .Include("Accounts.Profiles")
                .Single(x => x.Username == username);
            var account = user.Accounts.First();
            account.AccountStatus = AccountStatus.Paid;
            uow.SaveChanges();
        }

        protected readonly IWeddingBiddersUow uow;
    }
}