using Common.Data.Contracts;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Hubs;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [RoutePrefix("api/message")]
    public class MessageController : ApiController
    {
        public MessageController(IMessageService messageService,IWeddingBiddersUow uow)
        {
            this.uow = uow;
            this.repository = uow.Messages;
            this.messageService = messageService;
        }

        
        [HttpPost]
        [Route("add")]
        public IHttpActionResult add(MessageDto dto)
        {
            var message = this.messageService.Add(Request, dto);
            dto.FromProfileId = message.FromProfileId;
            dto.Id = message.Id;
            var context = GlobalHost.ConnectionManager.GetHubContext<MessageHub>();
            context.Clients.All.onMessageAdded(new { Data = dto });
            return Ok(dto);
        }


        protected readonly IWeddingBiddersUow uow;
        protected readonly IMessageService messageService;
        protected readonly IRepository<Message> repository;
    }
}
