namespace WeddingBidders.Core.Model.UserAggregate;

public class Role
{
    public Guid RoleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Privilege> Privileges { get; set; } = new List<Privilege>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
