﻿using Common.Controllers;
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
using System.Data.Entity;

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

            foreach(var wedding in weddings.OrderBy(x=>x.Date))
            {
                dtos.Add(new WeddingDto()
                {
                    Id = wedding.Id,
                    NumberOfGuests = wedding.NumberOfGuests,
                    NumberOfHours = wedding.NumberOfHours,
                    Location = wedding.Location,
                    Date = wedding.Date
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
        public IHttpActionResult GetById(int id)
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

        [HttpGet]
        [Route("getAllByCurrentProfile")]
        public IHttpActionResult GetAllByCurrentProfile()
        {
            var username = Request.GetRequestContext().Principal.Identity.Name;

            var profile = uow.Accounts.GetAll()
                .Include(x=>x.Profiles)
                .Where(x => x.Email.ToLower() == username.ToLower())
                .First()
                .Profiles.First();

            var weddings = new List<Wedding>();
            var dtos = new List<WeddingDto>();

            if (profile.ProfileType == ProfileType.Customer) {
                var customer = uow.Customers.GetAll().Where(x => x.Email == username).First();
                weddings = uow.Weddings.GetAll().Include(x=>x.Categories).Where(x => x.CustomerId == customer.Id).ToList();
            } else {
                var bidder = uow.Bidders.GetAll().Where(x => x.Email == username).First();
                foreach(var wedding in this.repository.GetAll().Include(x => x.Categories).ToList())
                {                    
                    foreach(var category in wedding.Categories)
                    {
                        if(category.Name.Replace(" ",string.Empty).ToLower() == bidder.BidderType.ToString().ToLower())
                            weddings.Add(wedding);                        
                    }
                }                
            }
            
            foreach(var wedding in weddings) {
                dtos.Add(new WeddingDto()
                {
                    Id = wedding.Id,
                    NumberOfGuests = wedding.NumberOfGuests,
                    NumberOfHours = wedding.NumberOfHours,
                    Location = wedding.Location,
                    Date = wedding.Date
                });
            }

            return Ok(dtos);
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
                CustomerId = customerId,
                Date  = dto.Date,
                Categories = dto.Categories.Select(x => new Category() {  Name = x.Name }).ToList()
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
