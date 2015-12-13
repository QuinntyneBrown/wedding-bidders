using System;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class BidderService : IBidderService
    {
        public BidderDto GetByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public BidderRegistrationResponseDto TryToRegister(BidderRegistrationRequestDto dto)
        {
            throw new NotImplementedException();
        }
    }
}