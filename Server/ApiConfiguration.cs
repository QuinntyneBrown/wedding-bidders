using System.Web.Http;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Owin;
using WeddingBidders.Server.Auth;
using Microsoft.Practices.Unity;
using Microsoft.AspNet.SignalR;
using WeddingBidders.Server.Config.Contracts;

namespace WeddingBidders.Server
{
    public class ApiConfiguration : Common.Web.ApiConfiguration
    {
        public new static void Install(HttpConfiguration config, IAppBuilder app)
        {
            config.SuppressHostPrincipal();

            WeddingBidders.Server.Services.Contracts.IIdentityService identityService = UnityConfiguration.GetContainer().Resolve<WeddingBidders.Server.Services.Contracts.IIdentityService>();

            WeddingBidders.Server.Config.Contracts.IConfigurationProvider configurationProvider = UnityConfiguration.GetContainer().Resolve<IConfigurationProvider>();
            
            app.UseOAuthAuthorizationServer(new OAuthOptions(identityService));

            app.UseJwtBearerAuthentication(new WeddingBidders.Server.Auth.JwtOptions(configurationProvider));

            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            app.UseCors(CorsOptions.AllowAll);

            app.MapSignalR();

            var jSettings = new JsonSerializerSettings();

            jSettings.ContractResolver = new SignalRContractResolver();

            jSettings.Formatting = Formatting.Indented;

            var serializer = JsonSerializer.Create(jSettings);

            GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => serializer);

            config.Formatters.Remove(config.Formatters.XmlFormatter);

            config.Formatters.JsonFormatter.SerializerSettings = jSettings;

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
                );

        }
    }
}