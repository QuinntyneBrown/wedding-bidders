using System.Web.Http;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Owin;
using WeddingBidders.Server.Auth;
using Microsoft.Practices.Unity;

namespace WeddingBidders.Server
{
    public class ApiConfiguration : Common.Web.ApiConfiguration
    {
        public new static void Install(HttpConfiguration config, IAppBuilder app)
        {
            config.SuppressHostPrincipal();

            WeddingBidders.Server.Services.Contracts.IIdentityService identityService = UnityConfiguration.GetContainer().Resolve<WeddingBidders.Server.Services.Contracts.IIdentityService>();

            app.UseOAuthAuthorizationServer(new OAuthOptions(identityService));

            app.UseJwtBearerAuthentication(new WeddingBidders.Server.Auth.JwtOptions());

            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            app.UseCors(CorsOptions.AllowAll);

            app.MapSignalR();

            var jSettings = new JsonSerializerSettings();

            jSettings.Formatting = Formatting.Indented;

            jSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

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