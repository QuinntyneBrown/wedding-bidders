using Common.Data.Contracts;
using System.Web.Http;
using System.Net.Http;
using System.Linq;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using System.Collections.Generic;

namespace WeddingBidders.Server.Controllers
{
    [RoutePrefix("api/bid")]
    public class BidController : ApiController
    {
        public BidController(IWeddingBiddersUow uow)
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
                CatererId = caterer.Id,
                Description = dto.Description,
                WeddingId = dto.WeddingId,
                Price = dto.Price
            };

            this.repository.Add(bid);
            this.uow.SaveChanges();
            
            var response = new BidResponseDto();

            return Ok(response);
        }

        [HttpGet]
        [Route("getAllByCatererId")]
        public IHttpActionResult GetAllByCatererId(int id)
        {
            var bidDtos = new List<BidDto>();
            foreach (var bid in uow.Bids.GetAll().Where(x => x.CatererId == id).ToList())
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

        protected readonly IWeddingBiddersUow uow;

        protected readonly IRepository<Bid> repository;
    }
}
