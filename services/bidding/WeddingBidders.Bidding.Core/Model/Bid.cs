using WeddingBidders.Shared.Core;

namespace WeddingBidders.Bidding.Core.Model;

public class Bid : BaseEntity
{
    public Guid BidId { get; set; }
    public Guid WeddingId { get; set; }
    public Guid BidderId { get; set; }
    public Bidder? Bidder { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public BidStatus Status { get; set; }
}

public enum BidStatus
{
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Withdrawn = 3
}
