using System.Configuration;

namespace WeddingBidders.Server.Config
{
    public class SmtpConfiguration : ConfigurationSection
    {
        [ConfigurationProperty("apiKey", IsRequired = true)]
        public string ApiKey
        {
            get { return (string)this["apiKey"]; }
            set { this["apiKey"] = value; }
        }

        [ConfigurationProperty("username", IsRequired = true)]
        public string Username
        {
            get { return (string)this["username"]; }
            set { this["username"] = value; }
        }

        [ConfigurationProperty("password", IsRequired = true)]
        public string Password
        {
            get { return (string)this["password"]; }
            set { this["password"] = value; }
        }

        public static SmtpConfiguration Config
        {
            get { return ConfigurationManager.GetSection("smtpConfiguration") as SmtpConfiguration; }
        }
    }
}
