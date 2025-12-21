namespace WeddingBidders.Api.Features.Profiles;

public class ProfileDto
{
    public Guid ProfileId { get; set; }
    public Guid UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public Guid? AvatarDigitalAssetId { get; set; }
    public string? PhoneNumber { get; set; }
}
