﻿using System.ComponentModel.DataAnnotations.Schema;

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

        public ProfileType ProfileType { get; set; }

        public bool IsPersonalized { get; set; }

        public bool IsApproved { get; set; }
    }
}
