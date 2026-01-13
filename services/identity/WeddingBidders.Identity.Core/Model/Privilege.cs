namespace WeddingBidders.Identity.Core.Model;

public class Privilege
{
    public Guid PrivilegeId { get; set; }
    public string Aggregate { get; set; } = string.Empty;
    public AccessRight AccessRight { get; set; }
    public Guid RoleId { get; set; }
    public Role? Role { get; set; }
}

public enum AccessRight
{
    Read = 0,
    Write = 1,
    Create = 2,
    Delete = 3
}
