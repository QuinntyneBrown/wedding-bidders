using Common.Controllers;
using Common.Data.Contracts;
using System.Linq;
using System.Web.Http;
using System.Net.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using System.Collections.Generic;
using WeddingBidders.Server.Hubs.contracts;
using Microsoft.AspNet.SignalR;
using WeddingBidders.Server.Hubs;

namespace WeddingBidders.Server.Controllers
{
    [System.Web.Http.Authorize]
    [RoutePrefix("api/wedding")]
    public class WeddingController : EFController<Wedding>
    {
        public WeddingController(IWeddingBiddersUow uow)
        {
            this.repository = uow.Weddings;
            this.uow = uow;
            
        }

        [HttpGet]
        [Route("getAll")]
        public IHttpActionResult GetAll()
        {
            var weddings = this.repository.GetAll();
            var dtos = new List<WeddingDto>();

            foreach(var wedding in weddings)
            {
                dtos.Add(new WeddingDto()
                {
                    Id = wedding.Id,
                    NumberOfGuests = wedding.NumberOfGuests,
                    NumberOfHours = wedding.NumberOfHours,
                    Location = wedding.Location
                });
            }

            return Ok(dtos);
        }

        [HttpGet]
        [Route("getAllByCustomerId")]
        public IHttpActionResult GetAllByCustomerId(int id)
        {
            var weddings = this.repository.GetAll().Where(x => x.CustomerId == id).ToList();
            var dtos = new HashSet<WeddingDto>();
            foreach(var wedding in weddings)
            {
                dtos.Add(new WeddingDto()
                {
                    Id = wedding.Id,
                    NumberOfGuests = wedding.NumberOfGuests,
                    NumberOfHours = wedding.NumberOfHours,
                    Location = wedding.Location
                });
            }
            return Ok(dtos);
        }

        
        [HttpGet]
        [Route("getById")]
        public IHttpActionResult getById(int id)
        {
            var wedding = this.repository.GetAll().Where(x => x.Id == id).Single();
            var dto = new WeddingDto()
            {
                Id = wedding.Id,
                NumberOfGuests = wedding.NumberOfGuests,
                NumberOfHours = wedding.NumberOfHours,
                Location = wedding.Location
            };
            
            return Ok(dto);
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult add(WeddingDto dto)
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;
            var customerId = uow.Customers.GetAll().Single(x => x.Email == username).Id;
            var wedding = new Wedding() {
                NumberOfGuests = dto.NumberOfGuests,
                Location = dto.Location,
                NumberOfHours = dto.NumberOfHours,
                CustomerId = customerId
            };
            this.repository.Add(wedding);
            this.uow.SaveChanges();
            dto.Id = wedding.Id;

            var context = GlobalHost.ConnectionManager.GetHubContext<WeddingHub>();
            context.Clients.All.onWeddingAdded(new { Data =  dto });
            return Ok(dto);
        }

        [HttpPut]
        [Route("update")]
        public IHttpActionResult update(WeddingDto dto)
        {
            var wedding = new Wedding() { NumberOfGuests = dto.NumberOfGuests };
            repository.Add(wedding);
            uow.SaveChanges();
            return Ok(wedding);
        }

        protected IRepository<Wedding> repository;
        protected IWeddingBiddersUow uow;
    }
}
