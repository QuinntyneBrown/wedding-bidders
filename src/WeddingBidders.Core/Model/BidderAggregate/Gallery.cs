namespace WeddingBidders.Core.Model.BidderAggregate;

public class Gallery
{
    public Guid GalleryId { get; set; }
    public Guid BidderId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public Bidder? Bidder { get; set; }
}
