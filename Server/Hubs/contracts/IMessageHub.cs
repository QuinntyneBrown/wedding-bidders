using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs.contracts
{
    public interface IMessageHub
    {
        void OnMessageAdded(Message message);
    }
}