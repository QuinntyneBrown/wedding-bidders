using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using WeddingBidders.Server.Hubs.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs
{
    [HubName("weddingHub")]
    public class WeddingHub: Hub,IWeddingHub
    {
        public WeddingHub() { }

        public void OnWeddingAdded(Wedding wedding)
        {
            Clients.Others.onWeddingAdded(wedding);
        }
    }
}