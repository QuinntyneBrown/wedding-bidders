using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class AccountDto
    {
        public AccountDto()
        {

        }

        public AccountDto(Account account)
        {
            this.AccountStatus = account.AccountStatus;
        }

        public AccountStatus AccountStatus { get; set; }
    }
}