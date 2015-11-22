using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Data;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Data
{
    public class WeddingBiddersContext : Common.Data.BaseDbContext, IWeddingBiddersContext
    {
        public WeddingBiddersContext()
            : base("securityContext")
        {
            
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<Group> Groups { get; set; }

        public DbSet<Account> Accounts { get; set; }

        public DbSet<Profile> Profiles { get; set; }

        public DbSet<Session> Sessions { get; set; }

    }
}
