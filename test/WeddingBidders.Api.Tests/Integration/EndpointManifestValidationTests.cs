using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Reflection;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Integration;

/// <summary>
/// Validates that all endpoints defined in the frontend-backend manifest
/// actually exist in the backend API controllers.
/// </summary>
public class EndpointManifestValidationTests : IClassFixture<WeddingBiddersWebApplicationFactory>
{
    private readonly WeddingBiddersWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private readonly HttpClient _authenticatedClient;

    public EndpointManifestValidationTests(WeddingBiddersWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        _authenticatedClient = factory.CreateClient();
        SetupAuthentication().GetAwaiter().GetResult();
    }

    private async Task SetupAuthentication()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<WeddingBiddersContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();

        var existingUser = context.Users.FirstOrDefault(u => u.Username == "manifest-test@test.com");
        Guid userId;
        Guid profileId;

        if (existingUser == null)
        {
            var (hash, salt) = passwordHasher.HashPassword("TestPassword123!");

            var memberRole = context.Roles.FirstOrDefault(r => r.Name == "Member");
            if (memberRole == null)
            {
                memberRole = new Role { RoleId = Guid.NewGuid(), Name = "Member", Privileges = new List<Privilege>() };
                context.Roles.Add(memberRole);
            }

            var user = new User
            {
                UserId = Guid.NewGuid(),
                Username = "manifest-test@test.com",
                Password = hash,
                Salt = salt,
                Roles = new List<Role> { memberRole }
            };
            context.Users.Add(user);

            var profile = new WeddingBidders.Core.Model.ProfileAggregate.Profile
            {
                ProfileId = Guid.NewGuid(),
                UserId = user.UserId
            };
            context.Profiles.Add(profile);

            await context.SaveChangesAsync();
            userId = user.UserId;
            profileId = profile.ProfileId;
        }
        else
        {
            userId = existingUser.UserId;
            var profile = context.Profiles.FirstOrDefault(p => p.UserId == existingUser.UserId);
            profileId = profile?.ProfileId ?? Guid.NewGuid();
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString()),
            new("UserId", userId.ToString()),
            new("ProfileId", profileId.ToString()),
            new(ClaimTypes.Name, "manifest-test@test.com"),
            new(ClaimTypes.Role, "Member")
        };

        var token = tokenService.GenerateAccessToken(claims);
        _authenticatedClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    [Fact]
    public void AllControllersHaveRouteAttributes()
    {
        // Get all controller types from the API assembly
        var apiAssembly = typeof(Program).Assembly;
        var controllerTypes = apiAssembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && typeof(ControllerBase).IsAssignableFrom(t))
            .ToList();

        foreach (var controllerType in controllerTypes)
        {
            var routeAttribute = controllerType.GetCustomAttribute<RouteAttribute>();
            routeAttribute.Should().NotBeNull(
                $"Controller {controllerType.Name} should have a [Route] attribute for endpoint discovery");
        }
    }

    [Fact]
    public void AllExpectedControllersExist()
    {
        // Verify that all controllers expected by frontend services exist
        var apiAssembly = typeof(Program).Assembly;
        var controllerTypes = apiAssembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && typeof(ControllerBase).IsAssignableFrom(t))
            .Select(t => t.Name.Replace("Controller", "").ToLowerInvariant())
            .ToList();

        var expectedControllers = new[]
        {
            "account",
            "bid",
            "bidder",
            "customer",
            "issue",
            "message",
            "conversation",
            "profile",
            "subscription",
            "user",
            "wedding"
        };

        foreach (var expected in expectedControllers)
        {
            controllerTypes.Should().Contain(expected,
                $"Backend should have a controller for '{expected}' as expected by the frontend");
        }
    }

    [Theory]
    [InlineData("GET", "/api/account/current", true)]
    [InlineData("GET", "/api/account/billing", true)]
    [InlineData("POST", "/api/user/token", false)]
    [InlineData("GET", "/api/user/current", true)]
    [InlineData("POST", "/api/user/change-password", true)]
    [InlineData("POST", "/api/bid/add", true)]
    [InlineData("GET", "/api/bid/getAllByWeddingId", true)]
    [InlineData("GET", "/api/bid/getAllByCatererId", true)]
    [InlineData("GET", "/api/bid/getAllByCurrentProfile", true)]
    [InlineData("GET", "/api/bidder/current", true)]
    [InlineData("GET", "/api/bidder/getAll", true)]
    [InlineData("GET", "/api/bidder/getById", true)]
    [InlineData("GET", "/api/bidder/GetByBidId", true)]
    [InlineData("GET", "/api/bidder/GetByProfileId", true)]
    [InlineData("GET", "/api/bidder/gettypes", false)]
    [InlineData("POST", "/api/bidder/add", false)]
    [InlineData("GET", "/api/customer/current", true)]
    [InlineData("GET", "/api/customer/getAll", true)]
    [InlineData("POST", "/api/customer/add", false)]
    [InlineData("GET", "/api/issue/getAll", true)]
    [InlineData("POST", "/api/issue/add", true)]
    [InlineData("GET", "/api/message/getByOtherProfileId", true)]
    [InlineData("POST", "/api/message/add", true)]
    [InlineData("GET", "/api/conversation/getAll", true)]
    [InlineData("GET", "/api/profile/current", true)]
    [InlineData("POST", "/api/profile", false)]
    [InlineData("POST", "/api/subscription/charge", true)]
    [InlineData("GET", "/api/user", true)]
    [InlineData("GET", "/api/wedding/getAll", true)]
    [InlineData("GET", "/api/wedding/getById", true)]
    [InlineData("GET", "/api/wedding/getAllByCustomerId", true)]
    [InlineData("GET", "/api/wedding/getAllByCurrentProfile", true)]
    [InlineData("POST", "/api/wedding/add", true)]
    [InlineData("PUT", "/api/wedding/update", true)]
    [InlineData("DELETE", "/api/wedding/remove", true)]
    public async Task EndpointFromManifestExists(string method, string path, bool requiresAuth)
    {
        // Arrange
        var client = requiresAuth ? _authenticatedClient : _client;

        // Add query params for endpoints that need them
        var fullPath = path;
        if (path.Contains("ById") || path.Contains("ByWeddingId") || path.Contains("ByCatererId") ||
            path.Contains("ByCustomerId") || path.Contains("ByOtherProfileId") ||
            path.Contains("ByBidId") || path.Contains("ByProfileId"))
        {
            if (path.Contains("ByBidId"))
                fullPath = $"{path}?bidId={Guid.NewGuid()}";
            else if (path.Contains("ByProfileId") || path.Contains("ByOtherProfileId"))
                fullPath = $"{path}?{(path.Contains("Other") ? "otherProfileId" : "profileId")}={Guid.NewGuid()}";
            else
                fullPath = $"{path}?id={Guid.NewGuid()}";
        }

        // Act
        HttpResponseMessage response;
        switch (method)
        {
            case "GET":
                response = await client.GetAsync(fullPath);
                break;
            case "POST":
                response = await client.PostAsJsonAsync(fullPath, new { });
                break;
            case "PUT":
                response = await client.PutAsJsonAsync(fullPath, new { });
                break;
            case "DELETE":
                response = await client.DeleteAsync(fullPath + (fullPath.Contains("?") ? "" : $"?id={Guid.NewGuid()}"));
                break;
            default:
                throw new ArgumentException($"Unsupported HTTP method: {method}");
        }

        // Assert - The endpoint should exist (not return 404 for route not found)
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            $"Frontend expects {method} {path} to exist in the backend API");
    }

    [Fact]
    public void FrontendServicesMatchBackendControllers()
    {
        // This test verifies the structural mapping between frontend and backend
        var frontendServices = new Dictionary<string, string[]>
        {
            ["AccountService"] = new[] { "GET /api/account/current", "GET /api/account/billing" },
            ["AuthService"] = new[] { "POST /api/user/token", "GET /api/user/current", "POST /api/user/change-password" },
            ["BidService"] = new[] { "POST /api/bid/add", "GET /api/bid/getAllByWeddingId", "GET /api/bid/getAllByCatererId", "GET /api/bid/getAllByCurrentProfile" },
            ["BidderService"] = new[] { "GET /api/bidder/current", "GET /api/bidder/getAll", "GET /api/bidder/getById", "GET /api/bidder/GetByBidId", "GET /api/bidder/GetByProfileId", "GET /api/bidder/gettypes", "POST /api/bidder/add" },
            ["CustomerService"] = new[] { "GET /api/customer/current", "GET /api/customer/getAll", "POST /api/customer/add" },
            ["IssueService"] = new[] { "GET /api/issue/getAll", "POST /api/issue/add" },
            ["MessageService"] = new[] { "GET /api/message/getByOtherProfileId", "POST /api/message/add", "GET /api/conversation/getAll" },
            ["ProfileService"] = new[] { "GET /api/profile/current", "POST /api/profile" },
            ["SubscriptionService"] = new[] { "POST /api/subscription/charge" },
            ["UserService"] = new[] { "GET /api/user/current", "GET /api/user/exists/{username}", "GET /api/user", "GET /api/user/{userId}" },
            ["WeddingService"] = new[] { "GET /api/wedding/getAll", "GET /api/wedding/getById", "GET /api/wedding/getAllByCustomerId", "GET /api/wedding/getAllByCurrentProfile", "POST /api/wedding/add", "PUT /api/wedding/update", "DELETE /api/wedding/remove" }
        };

        var apiAssembly = typeof(Program).Assembly;
        var controllers = apiAssembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && typeof(ControllerBase).IsAssignableFrom(t))
            .ToList();

        var backendEndpoints = new List<string>();

        foreach (var controller in controllers)
        {
            var routeAttr = controller.GetCustomAttribute<RouteAttribute>();
            var baseRoute = routeAttr?.Template ?? "";

            var methods = controller.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
            foreach (var method in methods)
            {
                var httpGet = method.GetCustomAttribute<HttpGetAttribute>();
                var httpPost = method.GetCustomAttribute<HttpPostAttribute>();
                var httpPut = method.GetCustomAttribute<HttpPutAttribute>();
                var httpDelete = method.GetCustomAttribute<HttpDeleteAttribute>();

                string httpMethod = "";
                string template = "";

                if (httpGet != null)
                {
                    httpMethod = "GET";
                    template = httpGet.Template ?? "";
                }
                else if (httpPost != null)
                {
                    httpMethod = "POST";
                    template = httpPost.Template ?? "";
                }
                else if (httpPut != null)
                {
                    httpMethod = "PUT";
                    template = httpPut.Template ?? "";
                }
                else if (httpDelete != null)
                {
                    httpMethod = "DELETE";
                    template = httpDelete.Template ?? "";
                }

                if (!string.IsNullOrEmpty(httpMethod))
                {
                    var fullRoute = string.IsNullOrEmpty(template)
                        ? $"/{baseRoute}"
                        : $"/{baseRoute}/{template}";
                    backendEndpoints.Add($"{httpMethod} {fullRoute}");
                }
            }
        }

        // Log discovered endpoints for debugging
        var allExpectedEndpoints = frontendServices.Values.SelectMany(x => x).ToList();

        // Normalize endpoints for comparison (remove route parameters for matching)
        foreach (var service in frontendServices)
        {
            foreach (var endpoint in service.Value)
            {
                var normalizedEndpoint = NormalizeEndpoint(endpoint);
                var matchingBackend = backendEndpoints.Any(be => NormalizeEndpoint(be).Equals(normalizedEndpoint, StringComparison.OrdinalIgnoreCase));

                matchingBackend.Should().BeTrue(
                    $"Frontend {service.Key} expects endpoint '{endpoint}' but it was not found in backend controllers");
            }
        }
    }

    private static string NormalizeEndpoint(string endpoint)
    {
        // Remove route parameters like {username}, {userId}, {userId:guid}
        var normalized = System.Text.RegularExpressions.Regex.Replace(endpoint, @"\{[^}]+\}", "{param}");
        return normalized.ToLowerInvariant().TrimEnd('/');
    }
}

public class EndpointManifest
{
    [JsonPropertyName("version")]
    public string Version { get; set; } = "";

    [JsonPropertyName("description")]
    public string Description { get; set; } = "";

    [JsonPropertyName("endpoints")]
    public List<ServiceEndpoints> Endpoints { get; set; } = new();
}

public class ServiceEndpoints
{
    [JsonPropertyName("service")]
    public string Service { get; set; } = "";

    [JsonPropertyName("frontendFile")]
    public string FrontendFile { get; set; } = "";

    [JsonPropertyName("endpoints")]
    public List<EndpointDefinition> Endpoints { get; set; } = new();
}

public class EndpointDefinition
{
    [JsonPropertyName("method")]
    public string Method { get; set; } = "";

    [JsonPropertyName("path")]
    public string Path { get; set; } = "";

    [JsonPropertyName("description")]
    public string Description { get; set; } = "";

    [JsonPropertyName("requiresAuth")]
    public bool RequiresAuth { get; set; }
}
