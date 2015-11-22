using Common.Caching;
using Common.Caching.Contracts;
using Microsoft.Practices.Unity;
using WeddingBidders.Server.Data;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Services;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server
{
    public class UnityConfiguration
    {
        public static IUnityContainer GetContainer(bool useMock = false)
        {
            var container = new UnityContainer();
            container.RegisterType<IWeddingBiddersUow, WeddingBiddersUow>();
            container.RegisterType<IWeddingBiddersContext, WeddingBiddersContext>();
            container.RegisterType<ISessionService, SessionService>();
            container.RegisterType<IIdentityService, IdentityService>();
            container.RegisterType<IEncryptionService, EncryptionService>();
            container.RegisterType<ICacheProvider, CacheProvider>();
            container.RegisterType<ISecurityService, SecurityService>();
            return container;
        }
    }
}