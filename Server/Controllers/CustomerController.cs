using Common.Data.Contracts;
using System.Collections.Generic;
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
    public class CustomerController : ApiController
    {
        public CustomerController(ICustomerService customerService, IWeddingBiddersUow uow)
        {
            this.service = customerService;
            this.uow = uow;
            this.repository = uow.Customers;
        }

        [HttpGet]
        [Route("current")]        
        public IHttpActionResult Current()
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;

            return Ok(service.GetByEmail(username));
        }

        [HttpGet]
        [Route("getAll")]
        [Authorize(Roles = "System")]
        public IHttpActionResult GetAll()
        {
            var customers = new List<CustomerDto>();

            foreach(var customer in repository.GetAll())
            {
                customers.Add(new CustomerDto(customer));
            }

            return Ok(customers);
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("add")]
        public IHttpActionResult TryToRegister(CustomerRegistrationRequestDto dto)
        {
            return Ok(this.service.TryToRegister(dto));
        }

        protected readonly ICustomerService service;
        protected readonly IWeddingBiddersUow uow;
        protected readonly IRepository<Customer> repository;

    }
}
