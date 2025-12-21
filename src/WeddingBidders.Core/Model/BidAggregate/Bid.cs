using WeddingBidders.Core.Model.BidderAggregate;
using WeddingBidders.Core.Model.WeddingAggregate;

namespace WeddingBidders.Core.Model.BidAggregate;

public class Bid
{
    public Guid BidId { get; set; }
    public Guid? WeddingId { get; set; }
    public Guid? BidderId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public Wedding? Wedding { get; set; }
    public Bidder? Bidder { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
}
