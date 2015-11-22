using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class MembershipService: IMembershipService
    {
        public MembershipService(IWeddingBiddersUow WeddingBiddersUow)
        {

        }

        public void Register(RegistrationRequestDto registrationRequestDto)
        {

        }

        protected IWeddingBiddersUow WeddingBiddersUow;
    }
}