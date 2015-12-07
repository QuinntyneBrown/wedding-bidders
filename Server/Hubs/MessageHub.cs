using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using WeddingBidders.Server.Hubs.contracts;
using WeddingBidders.Server.Services.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs
{
    [HubName("messageHub")]
    public class MessageHub: Hub, IMessageHub
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

        public void OnMessageAdded(Message message)
        {
            throw new NotImplementedException();
        }

        private IMessageService messageService;
    }
}