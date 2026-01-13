using WeddingBidders.Shared.Core;

namespace WeddingBidders.Identity.Core.Model;

public class InvitationToken : BaseEntity
{
    public Guid InvitationTokenId { get; set; }
    public string Token { get; set; } = string.Empty;
    public InvitationTokenType Type { get; set; }
    public bool IsUsed { get; set; }
    public DateTime ExpiryDate { get; set; }
}

public enum InvitationTokenType
{
    Registration = 0,
    PasswordReset = 1
}
