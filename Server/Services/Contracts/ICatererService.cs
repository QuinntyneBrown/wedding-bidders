using WeddingBidders.Server.Dtos;

namespace WeddingBidders.Server.Services.Contracts
{
    public interface ICatererService
    {        
        CatererRegistrationResponseDto TryToRegister(CatererRegistrationRequestDto dto);
    }
}
