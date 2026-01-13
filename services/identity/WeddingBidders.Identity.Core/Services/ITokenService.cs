using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Core.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
