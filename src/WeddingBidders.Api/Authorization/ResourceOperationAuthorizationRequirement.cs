using Microsoft.AspNetCore.Authorization;

namespace WeddingBidders.Api.Authorization;

public class ResourceOperationAuthorizationRequirement : IAuthorizationRequirement
{
    public string Name { get; }
    public string Resource { get; }

    public ResourceOperationAuthorizationRequirement(string name, string resource)
    {
        Name = name;
        Resource = resource;
    }
}
