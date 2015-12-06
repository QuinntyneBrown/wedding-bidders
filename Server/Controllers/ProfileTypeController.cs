using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Controllers
{
    [RoutePrefix("api/profiletype")]
    public class ProfileTypeController : ApiController
    {
        public ProfileTypeController()
        {

        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult Get()
        {
            var dictionary = new Dictionary<string,int>();

            foreach(var item in Enum.GetValues(typeof(ProfileType)))
            {
                dictionary.Add(item.ToString(), (int)(item));
            }

            return Ok(dictionary);
        }

    }
}
