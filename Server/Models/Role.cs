using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WeddingBidders.Server.Models
{
    public class Role : BaseEntity
    {
        public Role()
        {
            this.Users = new HashSet<User>();

        }

        public string Name { get; set; }

        public virtual ICollection<User> Users { get; set; }

    }
}
