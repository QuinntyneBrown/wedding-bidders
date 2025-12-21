using WeddingBidders.Core.Model.AccountAggregate;
using WeddingBidders.Core.Model.MessageAggregate;
using WeddingBidders.Core.Model.ProfileAggregate.Enums;
using WeddingBidders.Core.Model.UserAggregate;

namespace WeddingBidders.Core.Model.ProfileAggregate;

public class Profile
{
    public Guid ProfileId { get; set; }
    public Guid UserId { get; set; }
    public Guid? AccountId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? Name { get; set; }
    public Guid? AvatarDigitalAssetId { get; set; }
    public string? PhoneNumber { get; set; }
    public ProfileType ProfileType { get; set; }
    public bool IsPersonalized { get; set; }
    public bool IsApproved { get; set; }
    public bool IsDeleted { get; set; }
    public User? User { get; set; }
    public Account? Account { get; set; }
    public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
}
