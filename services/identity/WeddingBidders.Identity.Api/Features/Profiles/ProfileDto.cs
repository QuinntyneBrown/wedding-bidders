using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Api.Features.Profiles;

public class ProfileDto
{
    public Guid ProfileId { get; set; }
    public Guid UserId { get; set; }
    public Guid AccountId { get; set; }
    public string ProfileType { get; set; } = string.Empty;
    public bool IsPersonalized { get; set; }
}

public static class ProfileExtensions
{
    public static ProfileDto ToDto(this Profile profile)
    {
        return new ProfileDto
        {
            ProfileId = profile.ProfileId,
            UserId = profile.UserId,
            AccountId = profile.AccountId,
            ProfileType = profile.ProfileType.ToString(),
            IsPersonalized = profile.IsPersonalized
        };
    }
}
