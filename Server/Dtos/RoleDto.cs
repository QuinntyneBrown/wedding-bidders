using WeddingBidders.Server.Models;

namespace WeddingBidders.Server.Dtos
{
    public class RoleDto
    {
        public RoleDto()
        {
            
        }

        public RoleDto(Role role)
        {
            this.Id = role.Id;
            this.Name = role.Name;
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}