using Common.Caching;
using Common.Caching.Contracts;
using Microsoft.Practices.Unity;
using WeddingBidders.Server.Config;
using WeddingBidders.Server.Config.Contracts;
using WeddingBidders.Server.Data;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Hubs;
using WeddingBidders.Server.Hubs.contracts;
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
            container.RegisterType<IBidderService, BidderService>();
            container.RegisterType<ISessionService, SessionService>();
            container.RegisterType<IIdentityService, IdentityService>();
            container.RegisterType<IEncryptionService, EncryptionService>();
            container.RegisterType<ICacheProvider, CacheProvider>();
            container.RegisterType<ISecurityService, SecurityService>();
            container.RegisterType<ICustomerService, CustomerService>();
            container.RegisterType<IBidService, BidService>();
            container.RegisterType<IMessageService, MessageService>();
            container.RegisterType<IProfileService, ProfileService>();
            container.RegisterType<ICatererService, CatererService>();
            container.RegisterType<IBidHub, BidHub>();
            container.RegisterType<IMessageHub, IMessageHub>();
            container.RegisterType<IWeddingHub, WeddingHub>();
            container.RegisterType<IEmailService, EmailService>();
            container.RegisterType<IEmailBuilder, EmailBuilder>();
            container.RegisterType<IConfigurationProvider, ConfigurationProvider>();
            return container;
        }
    }
}