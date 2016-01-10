using System;
using System.Data.Entity;
using System.Linq;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Data
{
    public class WeddingBiddersContext : Common.Data.BaseDbContext, IWeddingBiddersContext
    {
        public WeddingBiddersContext()
            : base("weddingBiddersContext") { }

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
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Issue> Issues { get; set; }

        public override int SaveChanges()
        {
            foreach (var entry in this.ChangeTracker.Entries()
            .Where(e => e.Entity is ILoggable &&
                ((e.State == EntityState.Added || (e.State == EntityState.Modified)))))
            {

                if (((ILoggable)entry.Entity).CreatedDate == null)
                {
                    ((ILoggable)entry.Entity).CreatedDate = DateTime.UtcNow;
                }

                ((ILoggable)entry.Entity).LastModifiedDate = DateTime.UtcNow;

            }

            return base.SaveChanges();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().

                HasMany(u => u.Roles).
                WithMany(r => r.Users).

                Map(
                    m =>
                    {
                        m.MapLeftKey("User_Id");
                        m.MapRightKey("Role_Id");
                        m.ToTable("UserRoles");
                    });

            modelBuilder.Entity<User>().

                HasMany(u => u.Groups).
                WithMany(g => g.Users).

                Map(
                    m =>
                    {
                        m.MapLeftKey("User_Id");
                        m.MapRightKey("Group_Id");
                        m.ToTable("UserGroups");
                    });

            modelBuilder.Entity<Profile>().
                HasMany(u => u.Conversations).
                WithMany(r => r.Profiles).
                Map(
                    m =>
                    {
                        m.MapLeftKey("Profile_Id");
                        m.MapRightKey("Conversation_Id");
                        m.ToTable("ProfileConversations");
                    });
        }        
    }    
}
