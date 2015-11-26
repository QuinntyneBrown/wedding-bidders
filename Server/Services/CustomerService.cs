using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Services
{
    public class CustomerService : ICustomerService
    {
        public CustomerService(IWeddingBiddersUow uow)
        {
            this.uow = uow;
        }

        public CustomerRegistrationResponseDto TryToRegister(CustomerRegistrationRequestDto dto)
        {
            var response = new CustomerRegistrationResponseDto();
            var user = new User();

            return response;
        }

        protected readonly IWeddingBiddersUow uow;
    }
}