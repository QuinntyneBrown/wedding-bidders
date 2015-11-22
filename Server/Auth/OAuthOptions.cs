
using System;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using WeddingBidders.Server.Config;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Auth
{
    public class OAuthOptions : OAuthAuthorizationServerOptions
    {
        public OAuthOptions(WeddingBidders.Server.Services.Contracts.IIdentityService identityService)
        {
            var config = AppConfiguration.Config;

            TokenEndpointPath = new PathString(config.TokenPath);
            AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(config.ExpirationMinutes);
            AccessTokenFormat = new JwtWriterFormat(this);
            Provider = new OAuthProvider(identityService);
            AllowInsecureHttp = true;
        }

    }
}
