using System.Collections.Generic;
using System.Security.Claims;
using WeddingBidders.Server.Dtos;

namespace WeddingBidders.Server.Services.Contracts
{
    public interface IIdentityService
    {
        TokenDto SignIn(SignInDto signInDto);

        TokenDto TryToRegister(RegistrationRequestDto registrationRequestDto);

        bool AuthenticateUser(string username, string password);

        ICollection<Claim> GetClaimsForUser(string username);
    }
}