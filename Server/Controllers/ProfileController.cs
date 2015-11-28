using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using System.Linq;

using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Dtos;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/profile")]
    public class ProfileController : ApiController
    {
        public ProfileController(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        [HttpGet]
        public IHttpActionResult Current()
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;

            var user = uow.Users.GetAll()
                .Include(x=>x.Accounts)
                .Single(x => x.Username == username);

            var account = user.Accounts.First();
            if(account.AccountType == AccountType.Customer)
            {
                var customer = uow.Customers.GetAll().Single(x => x.Email == username);
                var dto = new CustomerDto()
                {
                    Firstname = customer.Firstname,
                    Lastname = customer.Lastname,
                    Email = customer.Email,
                    Id = customer.Id
                };

                return Ok(dto);
            } else
            {
                var caterer = uow.Caterers.GetAll().Single(x => x.Email == username);
                var dto = new CatererDto()
                {
                    Firstname = caterer.Firstname,
                    Lastname = caterer.Lastname,
                    Email = caterer.Email,
                    Id = caterer.Id
                };

                return Ok(dto);
            }


        }

        protected readonly IWeddingBiddersUow uow;
    }
}
