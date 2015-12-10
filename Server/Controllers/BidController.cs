using Common.Data.Contracts;
using System.Data.Entity;
using System.Web.Http;
using System.Net.Http;
using System.Linq;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using System.Collections.Generic;
using WeddingBidders.Server.Hubs.contracts;
using WeddingBidders.Server.Hubs;
using Microsoft.AspNet.SignalR;

namespace WeddingBidders.Server.Controllers
{
    [RoutePrefix("api/bid")]
    public class BidController : ApiController
    {
        public BidController(IBidHub bidHub, IWeddingBiddersUow uow)
        {
            this.uow = uow;
            this.repository = uow.Bids;
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult TryToAddBid(BidRequestDto dto)
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;
            var caterer = this.uow.Caterers.GetAll().Where(x => x.Email == username).Single();

            var bid = new Bid() {
                BidderId = caterer.Id,
                Description = dto.Description,
                WeddingId = dto.WeddingId,
                Price = dto.Price
            };

            this.repository.Add(bid);
            this.uow.SaveChanges();

            var response = new BidResponseDto(bid);
            var context = GlobalHost.ConnectionManager.GetHubContext<BidHub>();
            context.Clients.All.onBiddAdded(new { Data = response });
            return Ok(response);
        }

        [HttpGet]
        [Route("getAllByCatererId")]
        public IHttpActionResult GetAllByCatererId(int id)
        {
            var bidDtos = new List<BidDto>();
            foreach (var bid in uow.Bids.GetAll().Where(x => x.BidderId == id).ToList())
            {
                bidDtos.Add(new BidDto()
                {
                    Id = bid.Id,
                    Price = bid.Price,
                    Description = bid.Description,
                    WeddingId = bid.WeddingId
                });
            }
            return Ok(bidDtos);
        }

        [HttpGet]
        [Route("getAllByWeddingId")]
        public IHttpActionResult getAllByWeddingId(int id)
        {
            var bidDtos = new List<BidDto>();
            foreach(var bid in uow.Bids.GetAll().Where(x => x.WeddingId == id).ToList())
            {
                bidDtos.Add(new BidDto()
                {
                    Id = bid.Id,
                    Price = bid.Price,
                    Description = bid.Description,
                    WeddingId = bid.WeddingId
                });
            }
            return Ok(bidDtos);
        }

        [HttpGet]
        [Route("getAllByCurrentProfile")]
        public IHttpActionResult GetAllByCurrentProfile()
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;
            var profile = uow.Accounts.GetAll().Where(x => x.Email == username).First().Profiles.First();
            if(profile.ProfileType == ProfileType.Customer)
            {
                var customer = uow.Customers.GetAll()
                    .Where(x => x.ProfileId == profile.Id)
                    .Include(x => x.Weddings)
                    .Include("Weddings.Bids")
                    .First();

                var dtos = new List<BidDto>();

                foreach (var wedding in customer.Weddings)
                {
                    foreach(var bid in wedding.Bids)
                    {
                        dtos.Add(new BidDto()
                        {
                            Id = bid.Id,
                            Price = bid.Price,
                            Description = bid.Description,
                            WeddingId = bid.WeddingId
                        });
                    }
                }

                return Ok(dtos);
            }
           
            return Ok();
        }


        protected readonly IWeddingBiddersUow uow;

        protected readonly IRepository<Bid> repository;
        
    }
}
