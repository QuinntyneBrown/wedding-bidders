﻿using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Hubs.Contracts
{
    public interface IWeddingHub
    {
        void OnWeddingAdded(Wedding wedding);
    }
}
