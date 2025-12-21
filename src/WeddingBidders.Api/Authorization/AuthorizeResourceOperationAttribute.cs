namespace WeddingBidders.Api.Authorization;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class AuthorizeResourceOperationAttribute : Attribute
{
    public string Operation { get; }
    public string Resource { get; }

    public AuthorizeResourceOperationAttribute(string operation, string resource)
    {
        Operation = operation;
        Resource = resource;
    }
}

public static class Operations
{
    public const string Create = "Create";
    public const string Read = "Read";
    public const string Write = "Write";
    public const string Delete = "Delete";
}

public static class AggregateNames
{
    public const string User = "User";
    public const string Role = "Role";
    public const string Profile = "Profile";
    public const string InvitationToken = "InvitationToken";
}
