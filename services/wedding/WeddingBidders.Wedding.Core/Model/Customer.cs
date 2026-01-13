using WeddingBidders.Shared.Core;

namespace WeddingBidders.Wedding.Core.Model;

public class Customer : BaseEntity
{
    public Guid CustomerId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid ProfileId { get; set; }
    public ICollection<Wedding> Weddings { get; set; } = new List<Wedding>();
}
