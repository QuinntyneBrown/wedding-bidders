using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using WeddingBidders.Server.Data.Contracts;
using WeddingBidders.Server.Dtos;
using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Controllers
{
    [Authorize]
    [RoutePrefix("api/issue")]
    public class IssueController : ApiControllerBase
    {
        public IssueController(IWeddingBiddersUow uow)
            :base()
        { this.uow = uow; }

        [HttpGet]
        [Route("getAll")]
        [Authorize(Roles = "System")]
        public IHttpActionResult Get() => Ok(uow.Issues.GetAll().ToList().Select(x=> new IssueDto(x)));

        [HttpPost]
        [Route("add")]
        public IHttpActionResult Add(IssueRequestDto dto)
        {
            var currentProfile = uow.Accounts
                .GetAll()
                .Include(x => x.Profiles)
                .Where(x => x.Email == User.Identity.Name)
                .Single()
                .Profiles.First();

            var issue = new Issue()
            {

                ReportedById = currentProfile.Id,
                Subject = dto.Subject,
                Content = dto.Content,
                IssueStatus = IssueStatus.New
            };

            uow.Issues.Add(issue);
            uow.SaveChanges();

            return Ok();
        }


        protected readonly IWeddingBiddersUow uow;
    }
}
