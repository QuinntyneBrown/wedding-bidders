using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using WeddingBidders.Server.Hubs.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs
{
    [HubName("issueHub")]
    public class IssueHub : Hub, IIssueHub
    {
        public void OnIssueAdded(Wedding wedding)
        {
            throw new NotImplementedException();
        }
    }
}