using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingBidders.Server.Models
{
    public class Account : BaseEntity
    {
        public Account()
        {
            this.Profiles = new HashSet<Profile>();
        }

        public string Firstname { get; set; }

        public string Lastname { get; set; }

        public string Email { get; set; }

        public AccountType AccountType { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }

        public int? DefaultProfileId { get; set; }

        public ICollection<Profile> Profiles { get; set; }
        
        public User User { get; set; }

        public AccountStatus AccountStatus { get; set; }

    }
}
