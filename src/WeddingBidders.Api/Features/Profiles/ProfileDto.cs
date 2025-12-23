using WeddingBidders.Core.Model.ProfileAggregate;
using WeddingBidders.Core.Model.ProfileAggregate.Enums;

namespace WeddingBidders.Api.Features.Profiles;

public class ProfileDto
{
    public Guid ProfileId { get; set; }
    public Guid UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string? Name { get; set; }
    public Guid? AvatarDigitalAssetId { get; set; }
    public string? PhoneNumber { get; set; }
    public ProfileType ProfileType { get; set; }
    public bool IsPersonalized { get; set; }
    public bool IsApproved { get; set; }
    public string? AccountEmail { get; set; }
}

public static class ProfileExtensions
{
    public static ProfileDto ToDto(this Profile profile)
    {
        return new ProfileDto
        {
            ProfileId = profile.ProfileId,
            UserId = profile.UserId,
            Firstname = profile.Firstname,
            Lastname = profile.Lastname,
            Name = profile.Name,
            AvatarDigitalAssetId = profile.AvatarDigitalAssetId,
            PhoneNumber = profile.PhoneNumber,
            ProfileType = profile.ProfileType,
            IsPersonalized = profile.IsPersonalized,
            IsApproved = profile.IsApproved,
            AccountEmail = profile.Account?.Email
        };
    }
}
