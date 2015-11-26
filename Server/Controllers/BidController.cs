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
    public class BidController : ApiController
    {
        public BidController(IBidService service)
        {
            this.service = service;
        }

        public IHttpActionResult TryToBid(BidRequestDto dto)
        {
            return Ok(this.service.TryToBid(dto));
        }

        protected readonly IBidService service;
    }
}
