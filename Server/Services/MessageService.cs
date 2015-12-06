using WeddingBidders.Server.Data.Contracts;
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
    }
}