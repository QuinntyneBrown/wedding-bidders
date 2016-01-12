using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using WeddingBidders.Server.Dtos;

namespace WeddingBidders.Server.Hubs
{

    [HubName("messageHub")]
    public class MessageHub : Hub
    {
        public void Send(MessageDto dto)
        {
            Clients.Others.broadcastMessage(dto);
        }
    }
    
}