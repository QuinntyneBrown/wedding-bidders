using Microsoft.AspNetCore.Authorization;

namespace WeddingBidders.Api.Authorization;

public class ResourceOperationAuthorizationHandler : AuthorizationHandler<ResourceOperationAuthorizationRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOperationAuthorizationRequirement requirement)
    {
        var privilegeClaims = context.User.FindAll("privilege");
        var requiredPrivilege = $"{requirement.Name}{requirement.Resource}";

        if (privilegeClaims.Any(c => c.Value == requiredPrivilege))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
