using WeddingBidders.Core.Model.UserAggregate;

namespace WeddingBidders.Core.Model.ProfileAggregate;

public class Profile
{
    public Guid ProfileId { get; set; }
    public Guid UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public Guid? AvatarDigitalAssetId { get; set; }
    public string? PhoneNumber { get; set; }
    public User? User { get; set; }
}
