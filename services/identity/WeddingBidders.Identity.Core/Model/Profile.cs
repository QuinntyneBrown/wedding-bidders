using WeddingBidders.Shared.Core;

namespace WeddingBidders.Identity.Core.Model;

public class Profile : BaseEntity
{
    public Guid ProfileId { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public Guid AccountId { get; set; }
    public Account? Account { get; set; }
    public ProfileType ProfileType { get; set; }
    public bool IsPersonalized { get; set; }
}

public enum ProfileType
{
    Customer = 0,
    Bidder = 1
}
