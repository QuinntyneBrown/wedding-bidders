using System;
using Stripe;
using System.Configuration;

namespace WeddingBidders
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            //Stripe.StripeConfiguration.SetApiKey(WeddingBidders.Server.Config.StripeConfiguration.Config.StripeSecretKey);
        }
    }
}