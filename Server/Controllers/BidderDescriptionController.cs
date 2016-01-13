using System.Data;
using System.Linq;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/bidderDesciption")]
    public class BidderDescriptionController : ApiController
    {
        public BidderDescriptionController(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        [HttpPost]
        [Route("addOrUpdate")]
        [Authorize(Roles="System")]
        public IHttpActionResult AddOrUpdate(BidderDescriptionDto dto)
        {
            var bidderDescription = uow.BidderDescriptions
                .GetAll()
                .Where(x => x.BidderType == dto.BidderType)
                .FirstOrDefault();

            if (bidderDescription == null)
            {
                bidderDescription = new BidderDescription();
                uow.BidderDescriptions.Add(bidderDescription);
            }

            bidderDescription.Content = dto.Content;
            bidderDescription.BidderType = dto.BidderType;
                
            uow.SaveChanges();

            return Ok();
        }

        [HttpPost]
        [Route("getAll")]
        [Authorize(Roles = "System")]
        public IHttpActionResult GetAll()
            => Ok(uow.BidderDescriptions.GetAll().Select(x => new BidderDescriptionDto(x)));

        protected readonly IWeddingBiddersUow uow;
    }
}
