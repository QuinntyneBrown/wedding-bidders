﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class BidderRegistrationRequestDto
    {
        public BidderRegistrationRequestDto()
        {
            this.BidderType = BidderType.Caterer;
        }

        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string ConfirmEmail { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public BidderType BidderType { get; set; }
    }
}