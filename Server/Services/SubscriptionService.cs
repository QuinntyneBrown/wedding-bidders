using System.Data.Entity;
using System.Linq;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;
using Stripe;

namespace WeddingBidders.Server.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        public SubscriptionService(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        public void Charge(string username, SubscriptionChargeDto subscriptionChargeDto)
        {
            var chargeOptions = new StripeChargeCreateOptions()
            {
                Amount = 18000,
                Currency = "cad",
                Source = new StripeSourceOptions() {  TokenId = subscriptionChargeDto.Token },
                Description = "Membership Payment",
                ReceiptEmail = username
            };

            var chargeService = new StripeChargeService();
            var stripeCharge = chargeService.Create(chargeOptions);

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