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
            : base("weddingBiddersContext")
        {
            
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<Group> Groups { get; set; }

        public DbSet<Account> Accounts { get; set; }

        public DbSet<Profile> Profiles { get; set; }

        public DbSet<Session> Sessions { get; set; }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<Caterer> Caterers { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Gallery> Galleries { get; set; }

        public DbSet<Bidder> Bidders { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<Page> Pages { get; set; }

        public DbSet<HtmlContent> HtmlContents { get; set; }
    }
}
