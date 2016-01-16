using System.Web.Http;
using Microsoft.Owin;
using Owin;
using Unity.WebApi;

[assembly: OwinStartup(typeof(WeddingBidders.Startup))]

namespace WeddingBidders
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            Stripe.StripeConfiguration.SetApiKey(WeddingBidders.Server.Config.StripeConfiguration.Config.StripeSecretKey);

            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(WeddingBidders.Server.UnityConfiguration.GetContainer());

            GlobalConfiguration.Configure(config => WeddingBidders.Server.ApiConfiguration.Install(config, app));
        }
    }
}
