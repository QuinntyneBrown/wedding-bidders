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
        
        protected readonly IWeddingBiddersUow uow;
        protected readonly IRepository<Conversation> repository;
    }
}
