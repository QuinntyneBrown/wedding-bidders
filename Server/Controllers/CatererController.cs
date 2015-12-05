using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Services.Contracts;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/caterer")]
    public class CatererController : ApiController
    {
        public CatererController(IWeddingBiddersUow uow, ICatererService service)
        {
            this.service = service;
            this.uow = uow;
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
        public IHttpActionResult getAll()
        {
            var caterers = this.uow.Caterers.GetAll();
            var dtos = new List<CatererDto>();

            foreach(var caterer in caterers)
            {
                dtos.Add(new CatererDto()
                {
                    Id = caterer.Id,
                    Email = caterer.Email,
                    Firstname = caterer.Firstname,
                    Lastname = caterer.Lastname,
                    CompanyName = caterer.CompanyName
                });
            }

            return Ok(dtos);
        }

        [HttpPost]
        [Route("add")]
        [AllowAnonymous]
        public IHttpActionResult TryToRegister(CatererRegistrationRequestDto dto)
        {
            return Ok(this.service.TryToRegister(dto));
        }

        protected readonly ICatererService service;
        protected readonly IWeddingBiddersUow uow;
    }
}
