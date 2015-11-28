using Common.Data.Contracts;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;

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
            var bid = new Bid() {
                CatererId = dto.CatererId,
                Description = dto.Description,
                WeddingId = dto.WeddingId,
                Price = dto.Price
            };

            this.repository.Add(bid);
            this.uow.SaveChanges();
            
            var response = new BidResponseDto();

            return Ok(response);
        }

        protected readonly IWeddingBiddersUow uow;

        protected readonly IRepository<Bid> repository;
    }
}
