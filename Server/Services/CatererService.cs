using System;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class CatererService : ICatererService
    {
        public CatererService(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        public CatererRegistrationResponseDto TryToRegister(CatererRegistrationRequestDto dto)
        {
            throw new NotImplementedException();
        }

        protected readonly IWeddingBiddersUow uow;
    }
}