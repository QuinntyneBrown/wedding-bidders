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
        [Route("current")]
        public IHttpActionResult Current()
        {
            return Ok(service.GetCurrentAccount(Request));
        }

        [HttpGet]
        [Route("billing")]
        public IHttpActionResult Billing()
        {
            return Ok(service.GetBilling(Request));
        }

        protected readonly IAccountService service;
    }
}
