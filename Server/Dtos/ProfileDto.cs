using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class ProfileDto
    {
        public ProfileDto()
        {

        }

        public ProfileDto(Profile profile)
        {
            this.Id = profile.Id;
            this.Firstname = profile.Account.Firstname;
            this.Lastname = profile.Account.Lastname;
            this.Email = profile.Account.Email;
            this.Status = profile.Account.AccountStatus;
            this.IsApproved = profile.IsApproved;
            this.IsPersonalized = profile.IsPersonalized;
            this.ProfileType = profile.ProfileType;
        }

        public int? Id { get; set; }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }

        public bool IsPersonalized { get; set; }

        public bool IsApproved { get; set; }

        public AccountStatus Status { get; set; }

        public ProfileType ProfileType { get; set; }
    }
}