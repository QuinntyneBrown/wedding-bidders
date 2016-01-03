using System;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class MessageService: IMessageService
    {
        public MessageService(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        protected readonly IWeddingBiddersUow uow;

        public Message Add(HttpRequestMessage request, MessageDto dto)
        {
            var username = request.GetRequestContext().Principal.Identity.Name;
            var profileId = uow.Accounts.GetAll()
                .Include(x => x.Profiles).Single(x => x.Email == username)
                .Profiles
                .First().Id;

            Conversation converation = dto.ConversationId == null ? new Conversation() : uow.Conversations.GetById(dto.ConversationId.Value);
            
            var message = new Message()
            {
                FromProfileId = profileId,
                ToProfileId = dto.ToProfileId,
                Subject = dto.Subject,
                Content = dto.Content,
                MessageType = dto.MessageType,
                CreatedDate = DateTime.Now
            };

            if (dto.ConversationId == null)
            {
                if (message.MessageType == MessageType.Issue)
                {
                    converation.ConversationType = ConversationType.Issue;
                }
                else
                {
                    converation.ConversationType = ConversationType.InterProfile;
                }

                converation.Messages.Add(message);
                uow.Conversations.Add(converation);                                
            }            
            uow.SaveChanges();
            return message;
        }
    }
}