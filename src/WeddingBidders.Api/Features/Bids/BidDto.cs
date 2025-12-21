using WeddingBidders.Core.Model.BidAggregate;

namespace WeddingBidders.Api.Features.Bids;

public class BidDto
{
    public Guid BidId { get; set; }
    public Guid? WeddingId { get; set; }
    public Guid? BidderId { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
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
            Description = bid.Description
        };
    }
}
