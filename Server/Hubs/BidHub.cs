using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace WeddingBidders.Server.Hubs
{

    [HubName("bid")]
    public class BidHub: Hub
    {
        private static readonly ConcurrentDictionary<string, object> _connections =
            new ConcurrentDictionary<string, object>();

        public override Task OnConnected()
        {
            _connections.TryAdd(Context.ConnectionId, null);
            return Clients.All.clientCountChanged(_connections.Count);
        }

        public override Task OnReconnected()
        {
            _connections.TryAdd(Context.ConnectionId, null);
            return Clients.All.clientCountChanged(_connections.Count);
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            return base.OnDisconnected(stopCalled);
        }
    }
}