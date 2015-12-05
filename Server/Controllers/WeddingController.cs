using Common.Controllers;
using Common.Data.Contracts;
using System.Linq;
using System.Web.Http;
using System.Net.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;
using System.Collections.Generic;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
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
            return Ok(this.repository.GetAll());
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

        //getAllByCustomerId

        [HttpGet]
        [Route("getById")]
        public IHttpActionResult getById(int id)
        {
            return Ok(this.repository.GetById(id));
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
