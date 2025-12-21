namespace WeddingBidders.Api.Features.Users;

public class UserDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public Guid? DefaultProfileId { get; set; }
}
