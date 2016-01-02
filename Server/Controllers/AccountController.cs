using System.Web.Http;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/account")]
    public class AccountController : ApiController
    {
        public AccountController(IAccountService service)
        {
            this.service = service;
        }

        [HttpGet]
        public IHttpActionResult Current()
        {
            return Ok(service.GetCurrentAccount(Request));
        }

        [HttpGet]
        public IHttpActionResult Billing()
        {
            return Ok(service.GetBilling(Request));
        }

        protected readonly IAccountService service;
    }
}
