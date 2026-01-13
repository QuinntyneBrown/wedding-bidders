using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Api.Features.Users;

public class UserDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public Guid? CurrentProfileId { get; set; }
    public Guid? DefaultProfileId { get; set; }
    public List<string> Roles { get; set; } = new();
}

public static class UserExtensions
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            UserId = user.UserId,
            Username = user.Username,
            CurrentProfileId = user.CurrentProfileId,
            DefaultProfileId = user.DefaultProfileId,
            Roles = user.Roles.Select(r => r.Name).ToList()
        };
    }
}
