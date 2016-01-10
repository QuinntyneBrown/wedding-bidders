using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs.Contracts
{
    public interface IMessageHub
    {
        void OnMessageAdded(Message message);
    }
}