using WeddingBidders.Bidding.Core.Model;

namespace WeddingBidders.Bidding.Api.Features.Bids;

public class BidDto
{
    public Guid BidId { get; set; }
    public Guid WeddingId { get; set; }
    public Guid BidderId { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}

public static class BidExtensions
{
    public static BidDto ToDto(this Bid bid)
    {
        return new BidDto
        {
            BidId = bid.BidId,
            WeddingId = bid.WeddingId,
            BidderId = bid.BidderId,
            Price = bid.Price,
            Description = bid.Description,
            Status = bid.Status.ToString(),
            CreatedDate = bid.CreatedDate
        };
    }
}
