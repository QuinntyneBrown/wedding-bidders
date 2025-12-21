using WeddingBidders.Core.Model.AccountAggregate;
using WeddingBidders.Core.Model.AccountAggregate.Enums;

namespace WeddingBidders.Api.Features.Accounts;

public class AccountDto
{
    public Guid AccountId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public AccountType AccountType { get; set; }
    public AccountStatus AccountStatus { get; set; }
    public Guid? DefaultProfileId { get; set; }
}

public class BillingDto
{
    public AccountStatus AccountStatus { get; set; }
    public DateTime? SubscriptionExpiry { get; set; }
    public decimal? LastPaymentAmount { get; set; }
    public DateTime? LastPaymentDate { get; set; }
}

public static class AccountExtensions
{
    public static AccountDto ToDto(this Account account)
    {
        return new AccountDto
        {
            AccountId = account.AccountId,
            Firstname = account.Firstname,
            Lastname = account.Lastname,
            Email = account.Email,
            AccountType = account.AccountType,
            AccountStatus = account.AccountStatus,
            DefaultProfileId = account.DefaultProfileId
        };
    }
}
