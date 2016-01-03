using Common.Data.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
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
            this.uow = uow;
            this.repository = uow.Conversations;
        }

        [HttpGet]
        [Route("allIssues")]
        [Authorize(Roles="System")]
        public IHttpActionResult AllIssues ()
        {
            var converstations = repository
                .GetAll()
                .Include(x => x.Messages)
                .Where(x => x.ConversationType == ConversationType.Issue)
                .ToList()
                .Select(x => new ConversationDto(x));
                            
            return Ok(converstations);
        }

        [HttpGet]
        [Route("allInterProfileConversations")]
        [Authorize(Roles = "System")]
        public IHttpActionResult AllInterProfileConversations()
        {
            var converstations = repository
                .GetAll()
                .Include(x => x.Messages)
                .Where(x => x.ConversationType == ConversationType.InterProfile)
                .ToList()
                .Select(x => new ConversationDto(x));

            return Ok(converstations);
        }
        protected readonly IWeddingBiddersUow uow;
        protected readonly IRepository<Conversation> repository;
    }
}
