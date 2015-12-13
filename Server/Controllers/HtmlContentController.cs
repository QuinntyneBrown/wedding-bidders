using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;

namespace WeddingBidders.Server.Controllers
{
    public class HtmlContentController : ApiController
    {
        public HtmlContentController(IWeddingBiddersUow uow)
        {

        }

        protected readonly IWeddingBiddersUow uow;

    }
}
