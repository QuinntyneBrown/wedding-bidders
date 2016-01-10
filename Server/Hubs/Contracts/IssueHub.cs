using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs.Contracts
{
    public interface IIssueHub
    {
        void OnIssueAdded(Wedding wedding);
    }
}
