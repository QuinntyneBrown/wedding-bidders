using WeddingBidders.Server.Config.Contracts;
using System.Configuration;

namespace WeddingBidders.Server.Config
{
    public class StripeConfiguration : ConfigurationSection, IStripeConfiguration
    {
        [ConfigurationProperty("stripeSecretKey", IsRequired = true)]
        public string StripeSecretKey
        {
            get { return (string)this["stripeSecretKey"]; }
            set { this["stripeSecretKey"] = value; }
        }

        [ConfigurationProperty("stripePublishableKey", IsRequired = true)]
        public string StripePublishableKey
        {
            get { return (string)this["stripePublishableKey"]; }
            set { this["stripePublishableKey"] = value; }
        }

        public static StripeConfiguration Config
        {
            get { return ConfigurationManager.GetSection("stripeConfiguration") as StripeConfiguration; }
        }
    }
}