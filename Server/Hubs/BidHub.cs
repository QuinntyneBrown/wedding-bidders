using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using WeddingBidders.Server.Hubs.Contracts;
using WeddingBidders.Server.Models;
using System;

namespace WeddingBidders.Server.Hubs
{

    [HubName("bidHub")]
    public class BidHub : Hub, IBidHub
    {
        public void OnBidAdded(Bid bid)
        {
            throw new NotImplementedException();
        }
    }
}