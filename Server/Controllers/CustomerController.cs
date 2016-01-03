using Common.Data.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/customer")]
    public class CustomerController : ApiControllerBase
    {
        public CustomerController(ICustomerService customerService, IWeddingBiddersUow uow)
        {
            this.service = customerService;
            this.uow = uow;
            this.repository = uow.Customers;
        }

        [HttpGet]
        [Route("current")]        
        public IHttpActionResult Current() => Ok(service.GetByEmail(Username));
        

        [HttpGet]
        [Route("getAll")]
        [Authorize(Roles = "System")]
        public IHttpActionResult GetAll() 
            => Ok(repository
            .GetAll()
            .ToList()
            .Select(x => new CustomerDto(x)));


        [AllowAnonymous]
        [HttpPost]
        [Route("add")]
        public IHttpActionResult TryToRegister(CustomerRegistrationRequestDto dto)        
             => Ok(this.service.TryToRegister(dto));
        

        protected readonly ICustomerService service;
        protected readonly IWeddingBiddersUow uow;
        protected readonly IRepository<Customer> repository;

    }
}
