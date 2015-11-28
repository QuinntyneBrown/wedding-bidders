using WeddingBidders.Server.Data;
using WeddingBidders.Server.Models;
using System.Data.Entity.Migrations;

namespace WeddingBidders.Migrations
{
    public class RoleConfiguration
    {
        public static void Seed(WeddingBiddersContext context)
        {
            context.Roles.AddOrUpdate(new Role()
            {
                Name = "Customer",
                IsActive = true
            });

            context.Roles.AddOrUpdate(new Role()
            {
                Name = "Caterer",
                IsActive = true
            });

            context.Roles.AddOrUpdate(new Role()
            {
                Name = "System",
                IsActive = true
            });

            context.Roles.AddOrUpdate(new Role()
            {
                Name = "Admin",
                IsActive = true
            });

            context.SaveChanges();
        }
    }
}