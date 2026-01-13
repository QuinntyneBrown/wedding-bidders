using WeddingBidders.Shared.Core;

namespace WeddingBidders.Wedding.Core.Model;

public class Wedding : BaseEntity
{
    public Guid WeddingId { get; set; }
    public int NumberOfGuests { get; set; }
    public int NumberOfHours { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public ICollection<Category> Categories { get; set; } = new List<Category>();
}
