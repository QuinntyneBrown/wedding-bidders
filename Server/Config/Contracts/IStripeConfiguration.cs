namespace WeddingBidders.Server.Config.Contracts
{
    public interface IStripeConfiguration
    {
        string StripePublishableKey { get; }
        string StripeSecretKey { get; }
    }
}