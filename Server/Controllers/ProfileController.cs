using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/profile")]
    public class ProfileController : ApiController
    {
        public ProfileController(IProfileService service, IWeddingBiddersUow uow)
        {
            this.service = service;
            this.uow = uow;
        }

        [HttpGet]
        public IHttpActionResult Current()
        {            
            return Ok(service.GetCurrentProfile(Request));
        }

        [HttpPost]
        public IHttpActionResult UpdateIsPersonalizedFlag()
        {
            service.UpdateIsPersonalizedFlag(Request);
            return Ok();
        }

        [HttpGet]
        [Route("GetByBidId")]
        public IHttpActionResult GetByBidId(int bidId)
            => Ok(new ProfileDto(this.uow.Bidders
                            .GetAll()
                            .Include(x => x.Bids)
                            .Include(x => x.Profile)
                            .Include("Profile.Account")
                            .Where(x => x.Bids.Any(b => b.Id == bidId))
                            .Single().Profile));
        

        protected readonly IProfileService service;

        protected readonly IWeddingBiddersUow uow;
    }
}
