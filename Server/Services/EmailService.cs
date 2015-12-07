using System.Net;
using WeddingBidders.Server.Services.Contracts;
using WeddingBidders.Server.Config;

namespace WeddingBidders.Server.Services
{
    public class EmailService: IEmailService
    {
        public EmailService()
        {

        }

        public void SendAsync(SendGrid.SendGridMessage message)
        {
            var config = SmtpConfiguration.Config;            
            var transportWeb = new SendGrid.Web(new NetworkCredential(config.Username, config.Password));
            transportWeb.DeliverAsync(message);
        }        
    }
}