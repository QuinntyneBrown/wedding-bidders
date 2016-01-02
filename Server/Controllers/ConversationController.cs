using Common.Data.Contracts;
using System;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Controllers
{
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
