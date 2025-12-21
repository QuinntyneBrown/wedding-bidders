namespace WeddingBidders.Core.Model.SubscriptionAggregate;

public class Payment
{
    public Guid PaymentId { get; set; }
    public Guid AccountId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
}
