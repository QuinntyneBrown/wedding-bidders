using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
        public IHttpActionResult getAll()
        {
            var caterers = this.uow.Bidders.GetAll();
            var dtos = new List<BidderDto>();

            foreach (var caterer in caterers)
            {
                dtos.Add(new BidderDto()
                {
                });
            }

            return Ok(dtos);
        }

        [HttpGet]
        [Route("getById")]
        public IHttpActionResult GetById(int id)
        {
            var caterer = this.uow.Bidders.GetAll().Where(x => x.Id == id).Single();
            var dto = new BidderDto()
            {

            };
            return Ok(dto);
        }
        [HttpPost]
        [Route("add")]
        [AllowAnonymous]
        public IHttpActionResult TryToRegister(BidderRegistrationRequestDto dto)
        {
            return Ok(this.service.TryToRegister(dto));
        }

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
