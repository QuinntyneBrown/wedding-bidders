namespace WeddingBidders.Core.Model.WeddingAggregate;

public class Category
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? WeddingId { get; set; }
    public Wedding? Wedding { get; set; }
}
