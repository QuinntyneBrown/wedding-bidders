using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Net.Http;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/bidder")]
    public class BidderController : ApiController
    {
        public BidderController(IWeddingBiddersUow uow, IBidderService service)
        {
            this.uow = uow;
            this.service = service;
        }

        [HttpGet]
        [Route("current")]
        public IHttpActionResult Current()
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;
            return Ok(service.GetByEmail(username));
        }

        [HttpGet]
        [Route("getAll")]
        [Authorize(Roles = "System")]
        public IHttpActionResult getAll()
        {
            var bidders = new List<BidderDto>();
            foreach (var bidder in this.uow.Bidders.GetAll())
            {
                bidders.Add(new BidderDto(bidder));
            }
            return Ok(bidders);
        }

        [HttpGet]
        [Route("getById")]
        public IHttpActionResult GetById(int id)
        {
            var bidder = new BidderDto(this.uow.Bidders.GetAll().Where(x => x.Id == id).Single());
            return Ok(bidder);
        }


        [HttpGet]
        [Route("GetByBidId")]
        public IHttpActionResult GetByBidId(int bidId)
            => Ok(new BidderDto(this.uow.Bidders
                .GetAll()
                .Include(x => x.Bids)
                .Where(x => x.Bids.Any(b => b.Id == bidId))
                .Single()));

        [HttpGet]
        [Route("GetByProfileId")]
        public IHttpActionResult GetByProfileId(int profileId)
            => Ok(new BidderDto(this.uow.Bidders
                .GetAll()
                .Where(x => x.ProfileId == profileId)
                .Single()));


        [HttpPost]
        [Route("add")]
        [AllowAnonymous]
        public IHttpActionResult TryToRegister(BidderRegistrationRequestDto dto)
            => Ok(this.service.TryToRegister(dto));

        [HttpGet]
        [AllowAnonymous]
        [Route("gettypes")]
        public IHttpActionResult GetTypes()
        {
            ICollection<Dictionary<string, string>> results = new HashSet<Dictionary<string, string>>();
            foreach (var item in Enum.GetValues(typeof(BidderType)))
            {                
                var dictionary = new Dictionary<string, string>();
                dictionary.Add("name", item.ToString());
                dictionary.Add("value", Convert.ToString((int)item));
                results.Add(dictionary);
            }
            return Ok(results);
        }

        protected readonly IBidderService service;
        protected readonly IWeddingBiddersUow uow;
    }
}
