using System.Net.Http;

namespace WeddingBidders.Server.Services.Contracts
{
    public interface IProfileService
    {
        dynamic GetCurrentProfile(HttpRequestMessage request);
        void UpdateIsPersonalizedFlag(HttpRequestMessage request);
    }
}