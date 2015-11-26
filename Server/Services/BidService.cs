using System;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class BidService: IBidService
    {
        public BidService(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        public BidResponseDto TryToBid(BidRequestDto dto)
        {
            throw new NotImplementedException(); 
        }

        protected readonly IWeddingBiddersUow uow;
    }
}