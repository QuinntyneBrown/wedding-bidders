using WeddingBidders.Core.Model.UserAggregate.Enums;

namespace WeddingBidders.Core.Model.UserAggregate;

public class Privilege
{
    public Guid PrivilegeId { get; set; }
    public Guid RoleId { get; set; }
    public string Aggregate { get; set; } = string.Empty;
    public AccessRight AccessRight { get; set; }
    public Role? Role { get; set; }
}
