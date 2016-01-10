using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs.Contracts
{
    public interface IBidHub
    {
        void OnBidAdded(Bid bid);
    }
}
