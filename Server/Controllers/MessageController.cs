using Common.Data.Contracts;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Hubs;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Controllers
{
    [RoutePrefix("api/message")]
    public class MessageController : ApiController
    {
        public MessageController(IWeddingBiddersUow uow)
        {
            this.uow = uow;
            this.repository = uow.Messages;
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult add(MessageDto dto)
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;
            var customerId = uow.Customers.GetAll().Single(x => x.Email == username).Id;
            var message = new Message()
            {

            };

            var context = GlobalHost.ConnectionManager.GetHubContext<MessageHub>();
            context.Clients.All.onMessageAdded(new { Data = dto });
            return Ok(dto);
        }

        protected readonly IWeddingBiddersUow uow;

        protected readonly IRepository<Message> repository;
    }
}
