using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    public class CustomerController : ApiController
    {
        public CustomerController(ICustomerService customerService)
        {
            this.service = customerService;
        }

        public IHttpActionResult TryToRegister(CustomerRegistrationRequestDto dto)
        {
            return Ok(this.service.TryToRegister(dto));
        }

        protected readonly ICustomerService service;
    }
}
