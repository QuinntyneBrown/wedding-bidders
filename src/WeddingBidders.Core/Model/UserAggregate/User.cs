using WeddingBidders.Core.Model.ProfileAggregate;

namespace WeddingBidders.Core.Model.UserAggregate;

public class User
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public byte[] Salt { get; set; } = Array.Empty<byte>();
    public Guid? CurrentProfileId { get; set; }
    public Guid? DefaultProfileId { get; set; }
    public bool IsDeleted { get; set; }
    public ICollection<Role> Roles { get; set; } = new List<Role>();
    public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
}
