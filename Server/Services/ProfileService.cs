using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
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
                var customer = uow.Customers.GetAll().Single(x => x.Email == username);
                var dto = new CustomerProfileDto()
                {
                    Firstname = customer.Firstname,
                    Lastname = customer.Lastname,
                    Email = customer.Email,
                    Id = customer.Id
                };

                return dto;
            }
            else
            {
                var caterer = uow.Caterers.GetAll().Single(x => x.Email == username);
                var dto = new CatererProfileDto()
                {
                    Firstname = caterer.Firstname,
                    Lastname = caterer.Lastname,
                    Email = caterer.Email,
                    Id = caterer.Id
                };

                return dto;
            }
        }

    }
}