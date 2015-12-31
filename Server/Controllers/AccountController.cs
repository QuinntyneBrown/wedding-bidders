using System.Web.Http;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/account")]
    public class AccountController : ApiController
    {
        public AccountController(IProfileService service)
        {
            this.service = service;
        }

        [HttpGet]
        public IHttpActionResult Current()
        {
            return Ok(service.GetCurrentProfile(Request));
        }

        protected readonly IProfileService service;
    }
}
