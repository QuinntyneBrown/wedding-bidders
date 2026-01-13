using WeddingBidders.Shared.Core;

namespace WeddingBidders.Identity.Core.Model;

public class Account : BaseEntity
{
    public Guid AccountId { get; set; }
    public AccountType AccountType { get; set; }
    public AccountStatus AccountStatus { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
}

public enum AccountType
{
    Customer = 0,
    Bidder = 1
}

public enum AccountStatus
{
    Active = 0,
    Inactive = 1,
    Suspended = 2
}
