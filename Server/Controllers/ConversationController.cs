using Common.Data.Contracts;
using System.Linq;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Controllers
{
    [RoutePrefix("api/conversation")]
    public class ConversationController : ApiController
    {
        public ConversationController(IWeddingBiddersUow uow)
        {
            this.repository = uow.Conversations;
        }

        [HttpGet]
        [Route("getAll")]
        [Authorize(Roles = "System")]
        public IHttpActionResult getAll()
            => Ok(repository.GetAll().ToList().Select(x => new ConversationDto(x)));
        
        protected readonly IRepository<Conversation> repository;
    }
}
