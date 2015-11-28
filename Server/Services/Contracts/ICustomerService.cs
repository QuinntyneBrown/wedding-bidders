using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WeddingBidders.Server.Dtos;

namespace WeddingBidders.Server.Services.Contracts
{
    public interface ICustomerService
    {
        CustomerRegistrationResponseDto TryToRegister(CustomerRegistrationRequestDto dto);

        CustomerDto GetByEmail(string email);
    }
}