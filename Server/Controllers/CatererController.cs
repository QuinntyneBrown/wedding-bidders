using System.Web.Http;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    public class CatererController : ApiController
    {
        public CatererController(ICatererService service)
        {
            this.service = service;
        }

        public IHttpActionResult TryToRegister(CatererRegistrationRequestDto dto)
        {
            return Ok(this.service.TryToRegister(dto));
        }

        protected readonly ICatererService service;
    }
}
