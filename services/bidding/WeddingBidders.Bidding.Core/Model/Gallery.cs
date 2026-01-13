namespace WeddingBidders.Bidding.Core.Model;

public class Gallery
{
    public Guid GalleryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Url { get; set; } = string.Empty;
    public Guid BidderId { get; set; }
    public Bidder? Bidder { get; set; }
}
