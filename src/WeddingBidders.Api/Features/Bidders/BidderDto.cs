using WeddingBidders.Core.Model.BidderAggregate;
using WeddingBidders.Core.Model.BidderAggregate.Enums;

namespace WeddingBidders.Api.Features.Bidders;

public class BidderDto
{
    public Guid BidderId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? Description { get; set; }
    public Guid? ProfileId { get; set; }
    public BidderType BidderType { get; set; }
    public bool IsApproved { get; set; }
}

public static class BidderExtensions
{
    public static BidderDto ToDto(this Bidder bidder)
    {
        return new BidderDto
        {
            BidderId = bidder.BidderId,
            Firstname = bidder.Firstname,
            Lastname = bidder.Lastname,
            Email = bidder.Email,
            CompanyName = bidder.CompanyName,
            Description = bidder.Description,
            ProfileId = bidder.ProfileId,
            BidderType = bidder.BidderType,
            IsApproved = bidder.IsApproved
        };
    }
}
