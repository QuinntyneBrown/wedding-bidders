using System.Web.Http;

namespace WeddingBidders.Server.Controllers
{
    public class ApiControllerBase: ApiController
    {
        public string Username { get { return User.Identity.Name; } }
    }
}