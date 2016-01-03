using System.Net.Http;
using System.Web.Http;

namespace WeddingBidders.Server.Controllers
{
    public class ApiControllerBase: ApiController
    {
        public string Username { get { return Request.GetRequestContext().Principal.Identity.Name; } }
    }
}