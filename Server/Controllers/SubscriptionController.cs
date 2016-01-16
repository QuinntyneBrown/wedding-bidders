using System.Web.Http;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/subscription")]
    public class SubscriptionController : ApiController
    {

        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            this.subscriptionService = subscriptionService;
        }

        [HttpPost]
        [Route("charge")]
        public IHttpActionResult Charge(SubscriptionChargeDto subscriptionChargeDto)
        {
            this.subscriptionService.Charge(User.Identity.Name, subscriptionChargeDto);
            return Ok();
        }

        protected readonly ISubscriptionService subscriptionService;
    }
}
