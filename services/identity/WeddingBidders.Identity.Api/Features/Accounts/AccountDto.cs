using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Api.Features.Accounts;

public class AccountDto
{
    public Guid AccountId { get; set; }
    public string AccountType { get; set; } = string.Empty;
    public string AccountStatus { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public List<Guid> ProfileIds { get; set; } = new();
}

public static class AccountExtensions
{
    public static AccountDto ToDto(this Account account)
    {
        return new AccountDto
        {
            AccountId = account.AccountId,
            AccountType = account.AccountType.ToString(),
            AccountStatus = account.AccountStatus.ToString(),
            UserId = account.UserId,
            ProfileIds = account.Profiles.Select(p => p.ProfileId).ToList()
        };
    }
}
