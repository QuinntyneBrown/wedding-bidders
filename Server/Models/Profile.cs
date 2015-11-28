using System.ComponentModel.DataAnnotations.Schema;

namespace WeddingBidders.Server.Models
{
    public class Profile : BaseEntity
    {
        public Profile()
        {

        }

        [ForeignKey("Account")]
        public int? AccountId { get; set; }

        public string Name { get; set; }

        public Account Account { get; set; }
    }
}
