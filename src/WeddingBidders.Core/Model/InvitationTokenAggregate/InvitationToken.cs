using WeddingBidders.Core.Model.InvitationTokenAggregate.Enums;

namespace WeddingBidders.Core.Model.InvitationTokenAggregate;

public class InvitationToken
{
    public Guid InvitationTokenId { get; set; }
    public string Value { get; set; } = string.Empty;
    public DateTime? Expiry { get; set; }
    public InvitationTokenType Type { get; set; }
}
