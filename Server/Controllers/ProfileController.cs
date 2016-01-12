using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
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
        [Route("Current")]
        public IHttpActionResult Current() => Ok(service.GetCurrentProfile(Request));

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

        [HttpGet]
        [Authorize]
        [Route("getProfileById")]
        public IHttpActionResult GetById(int id)
            => Ok(new ProfileDto(uow.Profiles
                .GetAll()
                .Include(x=>x.Account)
                .Where(x=>x.Id ==id).Single()));

        [HttpGet]
        [Route("GetOthers")]
        public IHttpActionResult GetOthers()
        {
            var currentProfile = uow.Accounts
                .GetAll()
                .Include(x=>x.Profiles)
                .Where(x => x.Email == User.Identity.Name)
                .Single().Profiles.First();

            var results = new List<ProfileDto>();

            if (currentProfile.ProfileType == ProfileType.Customer) {

                var bidderProfileIds = uow.Weddings
                    .GetAll()
                    .Include(x => x.Bids)
                    .Include(x=>x.Customer)
                    .Include("Bids.Bidder")
                    .Where(x => x.Customer.ProfileId == currentProfile.Id)
                    .Select(x => x.Bids)
                    .SelectMany(b => b.Select(g => g.Bidder.ProfileId.Value)).ToList();

                results = this.uow.Profiles
                    .GetAll()
                    .Include(x=>x.Account)
                    .Where(x => bidderProfileIds.Contains(x.Id))
                    .ToList()
                    .Select(x => new ProfileDto(x)).ToList();

                return Ok(results);
            }

            var customerProfileIds = uow.Bids
                .GetAll()
                .Include(x => x.Bidder)
                .Include(x => x.Wedding)
                .Include("Wedding.Customer")
                .Include("Wedding.Customer.Profile")
                .Include("Bidder.Profile")
                .Where(x => x.Bidder.Profile.Id == currentProfile.Id
                && x.Wedding.IsDeleted == false) 
                .Select(x => x.Wedding)
                .Select(w => w.Customer.Profile.Id)
                .ToList();
            
            results = this.uow.Profiles
                .GetAll()
                .Include(x => x.Account)
                .Where(x => customerProfileIds.Contains(x.Id))
                .ToList()
                .Select(x => new ProfileDto(x)).ToList();

            return Ok(results);
        }


        protected readonly IProfileService service;

        protected readonly IWeddingBiddersUow uow;
    }
}
