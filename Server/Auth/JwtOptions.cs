using Microsoft.Owin.Security.Jwt;
using WeddingBidders.Server.Config;
using WeddingBidders.Server.Config.Contracts;

namespace WeddingBidders.Server.Auth
{
    public class JwtOptions : JwtBearerAuthenticationOptions
    {
        public JwtOptions(IConfigurationProvider configurationProvider)
        {
            var config = AppConfiguration.Config;

            AllowedAudiences = new[] { config.JwtAudience };
            IssuerSecurityTokenProviders = new[] 
            {
                new SymmetricKeyIssuerSecurityTokenProvider(config.JwtIssuer, config.JwtKey)
            };
        }
    }
}