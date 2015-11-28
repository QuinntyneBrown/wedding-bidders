﻿using Common.Data.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Data.Contracts
{
    public interface IWeddingBiddersUow
    {
        IRepository<User> Users { get; }

        IRepository<Account> Accounts { get; }

        IRepository<Profile> Profiles { get; }

        IRepository<Role> Roles { get;}
        
        IRepository<Group> Groups { get; }

        IRepository<Session> Sessions { get; }

        IRepository<Customer> Customers { get; }

        IRepository<Caterer> Caterers { get; }

        IRepository<Photo> Photos { get; }

        IRepository<Gallery> Galleries { get; }

        IRepository<Wedding> Weddings { get; }

        IRepository<Bid> Bids { get; }

        void SaveChanges();
    }
}
