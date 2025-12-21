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
    public const string Bidder = "Bidder";
    public const string Customer = "Customer";
    public const string Wedding = "Wedding";
    public const string Bid = "Bid";
    public const string Message = "Message";
    public const string Conversation = "Conversation";
    public const string Account = "Account";
    public const string Issue = "Issue";
    public const string Subscription = "Subscription";
}
