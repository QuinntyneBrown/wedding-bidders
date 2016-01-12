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


        [HttpGet]
        [Route("getByOtherProfileId")]
        public IHttpActionResult GetByOtherProfileId(int otherProfileId)
        {
            IEnumerable<MessageDto> response = new List<MessageDto>();

            var currentProfile = uow.Accounts
                .GetAll()
                .Include(x => x.Profiles)
                .Where(x => x.Email == User.Identity.Name)
                .Single().Profiles.First();

            var conversation = uow.Conversations
                .GetAll()
                .Include(x => x.Messages)
                .Where(x => x.Profiles.Any(p => p.Id == currentProfile.Id) && x.Profiles.Any(p => p.Id == otherProfileId))
                .FirstOrDefault();

            if (conversation != null)
                response = conversation.Messages.Select(x => new MessageDto(x));

            return Ok(response);
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult Send(SendMessageRequestDto dto)
        {
            var currentProfile = uow.Accounts
                .GetAll()
                .Include(x=> x.Profiles)
                .Where(x => x.Email == User.Identity.Name)
                .Single().Profiles.First();

            var conversation = uow.Conversations
                .GetAll()
                .Where(x => x.Profiles.Any(p => p.Id == currentProfile.Id))
                .Where(x => x.Profiles.Any(p => p.Id == dto.OtherProfileId))
                .FirstOrDefault();

            if (conversation == null)
            {
                conversation = new Conversation();
                conversation.Profiles.Add(currentProfile);
                conversation.Profiles.Add(uow.Profiles.GetById(dto.OtherProfileId));
                uow.Conversations.Add(conversation);
            }

            var message = new Message();
            message.FromProfileId = currentProfile.Id;
            message.ToProfileId = dto.OtherProfileId;
            message.Content = dto.Content;
            conversation.Messages.Add(message);

            uow.SaveChanges();

            return Ok(new MessageDto(message));
        }


        protected readonly IWeddingBiddersUow uow;
        protected readonly IMessageService messageService;
        protected readonly IRepository<Message> repository;
    }
}
