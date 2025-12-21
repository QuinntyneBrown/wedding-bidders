using WeddingBidders.Core.Model.BidAggregate;
using WeddingBidders.Core.Model.BidderAggregate.Enums;
using WeddingBidders.Core.Model.ProfileAggregate;

namespace WeddingBidders.Core.Model.BidderAggregate;

public class Bidder
{
    public Guid BidderId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? Description { get; set; }
    public Guid? ProfileId { get; set; }
    public Profile? Profile { get; set; }
    public BidderType BidderType { get; set; }
    public bool IsApproved { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public ICollection<Gallery> Galleries { get; set; } = new List<Gallery>();
    public ICollection<Bid> Bids { get; set; } = new List<Bid>();
}
