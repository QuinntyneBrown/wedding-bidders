using System.Net.Http;
using WeddingBidders.Server.Dtos;

namespace WeddingBidders.Server.Services.Contracts
{
    public interface ISubscriptionService
    {
        void Charge(HttpRequestMessage request, SubscriptionChargeDto subscriptionChargeDto);
    }
}
