using WeddingBidders.Server.Dtos;

namespace WeddingBidders.Server.Services.Contracts
{
    public interface IBidderService
    {
        BidderRegistrationResponseDto TryToRegister(BidderRegistrationRequestDto dto);

        BidderDto GetByEmail(string email);
    }
}
