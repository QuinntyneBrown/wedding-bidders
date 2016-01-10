using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/issue")]
    public class IssueController : ApiControllerBase
    {
        public IssueController(IWeddingBiddersUow uow)
            :base()
        {
            this.uow = uow;
        }

        [HttpGet]
        [Route("get")]
        [Authorize(Roles = "System")]
        public IHttpActionResult Get() => Ok();        


        protected readonly IWeddingBiddersUow uow;
    }
}
