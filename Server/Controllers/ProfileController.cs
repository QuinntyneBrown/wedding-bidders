using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using System.Linq;

using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/profile")]
    public class ProfileController : ApiController
    {
        public ProfileController(IProfileService service)
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
