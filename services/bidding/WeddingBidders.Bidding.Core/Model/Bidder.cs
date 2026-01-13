using WeddingBidders.Shared.Core;

namespace WeddingBidders.Bidding.Core.Model;

public class Bidder : BaseEntity
{
    public Guid BidderId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? Description { get; set; }
    public Guid ProfileId { get; set; }
    public BidderType BidderType { get; set; }
    public bool IsApproved { get; set; }
    public ICollection<Gallery> Galleries { get; set; } = new List<Gallery>();
    public ICollection<Bid> Bids { get; set; } = new List<Bid>();
}

public enum BidderType
{
    Photographer = 0,
    Videographer = 1,
    Caterer = 2,
    Florist = 3,
    DJ = 4,
    Band = 5,
    Planner = 6,
    Decorator = 7,
    Other = 8
}
