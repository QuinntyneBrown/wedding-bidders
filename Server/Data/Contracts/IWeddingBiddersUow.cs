﻿using Common.Data.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Data.Contracts
{
    public interface IWeddingBiddersUow
    {
        IRepository<User> Users { get; }

        IRepository<Role> Roles { get;}
        
        IRepository<Group> Groups { get; }

        IRepository<Session> Sessions { get; }

        IRepository<Customer> Customers { get; }

        IRepository<Caterer> Caterers { get; }

        void SaveChanges();
    }
}
