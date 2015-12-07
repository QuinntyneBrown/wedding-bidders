using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WeddingBidders.Server.Hubs.contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs
{
    [HubName("weddingHub")]
    public class WeddingHub: Hub,IWeddingHub
    {
        public WeddingHub()
        {

        }

        public void OnWeddingAdded(Wedding wedding)
        {
            throw new NotImplementedException();
        }
    }
}