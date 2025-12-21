using WeddingBidders.Core.Model.ProfileAggregate;
using WeddingBidders.Core.Model.WeddingAggregate;

namespace WeddingBidders.Core.Model.CustomerAggregate;

public class Customer
{
    public Guid CustomerId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? ProfileId { get; set; }
    public Profile? Profile { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public ICollection<Wedding> Weddings { get; set; } = new List<Wedding>();
}
