using System.Net.Http;
using System.Web.Http;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/caterer")]
    public class CatererController : ApiController
    {
        public CatererController(ICatererService service)
        {
            this.service = service;
        }
       
        [HttpGet]
        [Route("current")]
        public IHttpActionResult Current()
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;
            return Ok(service.GetByEmail(username));
        }

        [HttpPost]
        [Route("add")]
        [AllowAnonymous]
        public IHttpActionResult TryToRegister(CatererRegistrationRequestDto dto)
        {
            return Ok(this.service.TryToRegister(dto));
        }

        protected readonly ICatererService service;
    }
}
