using WeddingBidders.Bidding.Core.Model;

namespace WeddingBidders.Bidding.Api.Features.Bidders;

public class BidderDto
{
    public Guid BidderId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public string? Description { get; set; }
    public Guid ProfileId { get; set; }
    public string BidderType { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public List<GalleryDto> Galleries { get; set; } = new();
}

public class GalleryDto
{
    public Guid GalleryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Url { get; set; } = string.Empty;
}

public static class BidderExtensions
{
    public static BidderDto ToDto(this Bidder bidder)
    {
        return new BidderDto
        {
            BidderId = bidder.BidderId,
            FirstName = bidder.FirstName,
            LastName = bidder.LastName,
            Email = bidder.Email,
            CompanyName = bidder.CompanyName,
            Description = bidder.Description,
            ProfileId = bidder.ProfileId,
            BidderType = bidder.BidderType.ToString(),
            IsApproved = bidder.IsApproved,
            Galleries = bidder.Galleries.Select(g => new GalleryDto
            {
                GalleryId = g.GalleryId,
                Title = g.Title,
                Description = g.Description,
                Url = g.Url
            }).ToList()
        };
    }
}
