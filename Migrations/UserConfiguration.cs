using WeddingBidders.Server.Data;
using WeddingBidders.Server.Models;
using System.Data.Entity.Migrations;
using System.Linq;

namespace WeddingBidders.Migrations
{
    public class UserConfiguration
    {
        public static void Seed(WeddingBiddersContext context)
        {
            if (context.Users.FirstOrDefault(x => x.Username == "quinntyne@hotmail.com") == null)
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
                user.Accounts.Add(account);
                account.Profiles.Add(profile);
                context.Users.AddOrUpdate(user);
                context.SaveChanges();
            }

        }
    }
}