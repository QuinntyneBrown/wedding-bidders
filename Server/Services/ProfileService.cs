using System.Linq;
using System.Net.Http;
using System.Data.Entity;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Services.Contracts;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Dtos;

namespace WeddingBidders.Server.Services
{
    public class ProfileService : IProfileService
    {
        protected readonly IWeddingBiddersUow uow;

        public ProfileService(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        public dynamic GetCurrentProfile(HttpRequestMessage request)
        {
            var username = request.GetRequestContext().Principal.Identity.Name;

            var user = uow.Users.GetAll()
                .Include(x => x.Accounts)
                .Single(x => x.Username == username);

            var account = user.Accounts.First();
            if (account.AccountType == AccountType.Customer)
            {
                var customer = uow.Customers.GetAll()
                    .Include(x=>x.Weddings)                    
                    .Single(x => x.Email == username);

                var dto = new CustomerProfileDto()
                {
                    Firstname = customer.Firstname,
                    Lastname = customer.Lastname,
                    Email = customer.Email,
                    Id = customer.Id
                };

                foreach(var wedding in customer.Weddings.OrderBy(x=>x.Date))
                {
                    var weddingDto = new WeddingDto()
                    {
                        Id = wedding.Id,
                        NumberOfGuests = wedding.NumberOfGuests,
                        NumberOfHours = wedding.NumberOfHours,
                        Location = wedding.Location,
                        Date = wedding.Date
                    };

                    foreach(var bid in uow.Bids.GetAll().Where(x=> x.WeddingId  == wedding.Id))
                    {
                        weddingDto.Bids.Add(new BidDto()
                        {
                            Id = bid.Id,
                            Price = bid.Price,
                            Description = bid.Description,
                            WeddingId = bid.WeddingId
                        });
                    }

                    dto.Weddings.Add(weddingDto);
                }

                return dto;
            }
            else
            {
                var caterers = uow.Caterers.GetAll();

                var caterer = uow.Caterers.GetAll().Single(x => x.Email == username);
                var dto = new CatererProfileDto()
                {
                    Firstname = caterer.Firstname,
                    Lastname = caterer.Lastname,
                    Email = caterer.Email,
                    Id = caterer.Id
                };

                foreach (var bid in caterer.Bids)
                {
                    dto.Bids.Add(new BidDto()
                    {
                        Id = bid.Id,
                        Price = bid.Price,
                        Description = bid.Description,
                        WeddingId = bid.WeddingId
                    });
                }

                return dto;
            }
        }

    }
}