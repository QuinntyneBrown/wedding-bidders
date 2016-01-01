using System.Web.Http;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    public class SubscriptionController : ApiController
    {
        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            this.subscriptionService = subscriptionService;
        }

        public IHttpActionResult Charge(SubscriptionChargeDto subscriptionChargeDto)
        {
            this.subscriptionService.Charge(Request, subscriptionChargeDto);
            return Ok();
        }

        protected readonly ISubscriptionService subscriptionService;
    }
}
