using WeddingBidders.Server.Data;
using WeddingBidders.Server.Models;
using System.Data.Entity.Migrations;

namespace WeddingBidders.Migrations
{
    public class UserConfiguration
    {
        public static void Seed(WeddingBiddersContext context)
        {
            var user = new User()
            {
                Username = "quinntyne@hotmail.com",
                Firstname = "Quinntyne",
                Lastname = "Brown",
                Password = "XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg=",
            };

            var account = new Account()
            {
                Firstname = "Quinntyne",
                Lastname = "Brown",
                Email = "quinntyne@hotmail.com",
                AccountType = AccountType.Internal,
                User = user
            };

            var profile = new Profile()
            {
                Name = "Quinntyne Brown",
                Account = account,
                ProfileType = ProfileType.Internal
            };

            context.Users.AddOrUpdate(user);
            context.Accounts.AddOrUpdate(account);            
            context.SaveChanges();
        }
    }
}