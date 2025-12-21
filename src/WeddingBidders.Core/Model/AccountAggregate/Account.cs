using WeddingBidders.Core.Model.AccountAggregate.Enums;
using WeddingBidders.Core.Model.ProfileAggregate;
using WeddingBidders.Core.Model.UserAggregate;

namespace WeddingBidders.Core.Model.AccountAggregate;

public class Account
{
    public Guid AccountId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public AccountType AccountType { get; set; }
    public AccountStatus AccountStatus { get; set; }
    public Guid? UserId { get; set; }
    public Guid? DefaultProfileId { get; set; }
    public User? User { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
}
