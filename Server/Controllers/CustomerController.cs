using System.Net.Http;
using System.Web.Http;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/customer")]
    public class CustomerController : ApiController
    {
        public CustomerController(ICustomerService customerService)
        {
            this.service = customerService;
        }

        [HttpGet]
        [Route("current")]        
        public IHttpActionResult Current()
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;

            return Ok(service.GetByEmail(username));
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("add")]
        public IHttpActionResult TryToRegister(CustomerRegistrationRequestDto dto)
        {
            return Ok(this.service.TryToRegister(dto));
        }

        protected readonly ICustomerService service;
    }
}
