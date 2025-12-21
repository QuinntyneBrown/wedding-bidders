using WeddingBidders.Core.Model.BidAggregate;
using WeddingBidders.Core.Model.CustomerAggregate;

namespace WeddingBidders.Core.Model.WeddingAggregate;

public class Wedding
{
    public Guid WeddingId { get; set; }
    public int NumberOfGuests { get; set; }
    public int NumberOfHours { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    public ICollection<Bid> Bids { get; set; } = new List<Bid>();
}
