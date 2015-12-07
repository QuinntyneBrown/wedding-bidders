using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs.contracts
{
    public interface IBidHub
    {
        void OnBidAdded(Bid bid);
    }
}
