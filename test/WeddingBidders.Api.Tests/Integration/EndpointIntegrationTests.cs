using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Integration;

/// <summary>
/// E2E integration tests to verify that all frontend HTTP service endpoints
/// have corresponding backend API endpoints. This prevents the frontend from
/// trying to call endpoints that don't exist.
/// </summary>
public class EndpointIntegrationTests : IClassFixture<WeddingBiddersWebApplicationFactory>
{
    private readonly WeddingBiddersWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private readonly HttpClient _authenticatedClient;
    private Guid _testUserId;
    private Guid _testProfileId;

    public EndpointIntegrationTests(WeddingBiddersWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
        _authenticatedClient = factory.CreateClient();

        SetupTestDataAndAuthentication().GetAwaiter().GetResult();
    }

    private async Task SetupTestDataAndAuthentication()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<WeddingBiddersContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        var tokenService = scope.ServiceProvider.GetRequiredService<ITokenService>();

        // Create test user if not exists
        var existingUser = context.Users.FirstOrDefault(u => u.Username == "integration-test@test.com");
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
                Username = "integration-test@test.com",
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

            _testUserId = user.UserId;
            _testProfileId = profile.ProfileId;
        }
        else
        {
            _testUserId = existingUser.UserId;
            var profile = context.Profiles.FirstOrDefault(p => p.UserId == existingUser.UserId);
            _testProfileId = profile?.ProfileId ?? Guid.NewGuid();
        }

        // Generate JWT token for authenticated requests
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, _testUserId.ToString()),
            new("UserId", _testUserId.ToString()),
            new("ProfileId", _testProfileId.ToString()),
            new(ClaimTypes.Name, "integration-test@test.com"),
            new(ClaimTypes.Role, "Member")
        };

        var token = tokenService.GenerateAccessToken(claims);
        _authenticatedClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    #region Account Endpoints

    [Fact]
    public async Task AccountService_GetCurrentAccount_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/account/current");

        // Assert - Endpoint exists (not 404 Not Found on the route level)
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend AccountService.getCurrentAccount() expects GET /api/account/current to exist");
    }

    [Fact]
    public async Task AccountService_GetBilling_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/account/billing");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend AccountService.getBilling() expects GET /api/account/billing to exist");
    }

    #endregion

    #region Auth/User Endpoints

    [Fact]
    public async Task AuthService_Login_EndpointExists()
    {
        // Act
        var response = await _client.PostAsJsonAsync("/api/user/token", new { Username = "test", Password = "test" });

        // Assert - Unauthorized is fine, we just need to verify the endpoint exists
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend AuthService.login() expects POST /api/user/token to exist");
    }

    [Fact]
    public async Task AuthService_GetCurrentUser_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/user/current");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend AuthService.getCurrentUser() expects GET /api/user/current to exist");
    }

    [Fact]
    public async Task AuthService_ChangePassword_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.PostAsJsonAsync("/api/user/change-password",
            new { CurrentPassword = "old", NewPassword = "new" });

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend AuthService.changePassword() expects POST /api/user/change-password to exist");
    }

    #endregion

    #region Bid Endpoints

    [Fact]
    public async Task BidService_CreateBid_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.PostAsJsonAsync("/api/bid/add",
            new { WeddingId = Guid.NewGuid(), Amount = 100, Description = "test" });

        // Assert - BadRequest is fine (validation), we just check endpoint exists
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidService.createBid() expects POST /api/bid/add to exist");
    }

    [Fact]
    public async Task BidService_GetBidsByWeddingId_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync($"/api/bid/getAllByWeddingId?id={Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidService.getBidsByWeddingId() expects GET /api/bid/getAllByWeddingId to exist");
    }

    [Fact]
    public async Task BidService_GetBidsByCatererId_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync($"/api/bid/getAllByCatererId?id={Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidService.getBidsByBidderId() expects GET /api/bid/getAllByCatererId to exist");
    }

    [Fact]
    public async Task BidService_GetBidsByCurrentProfile_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/bid/getAllByCurrentProfile");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidService.getBidsByCurrentProfile() expects GET /api/bid/getAllByCurrentProfile to exist");
    }

    #endregion

    #region Bidder Endpoints

    [Fact]
    public async Task BidderService_GetCurrentBidder_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/bidder/current");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidderService.getCurrentBidder() expects GET /api/bidder/current to exist");
    }

    [Fact]
    public async Task BidderService_GetAllBidders_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/bidder/getAll");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidderService.getAllBidders() expects GET /api/bidder/getAll to exist");
    }

    [Fact]
    public async Task BidderService_GetBidderById_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync($"/api/bidder/getById?id={Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidderService.getBidderById() expects GET /api/bidder/getById to exist");
    }

    [Fact]
    public async Task BidderService_GetBidderByBidId_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync($"/api/bidder/GetByBidId?bidId={Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidderService.getBidderByBidId() expects GET /api/bidder/GetByBidId to exist");
    }

    [Fact]
    public async Task BidderService_GetBidderByProfileId_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync($"/api/bidder/GetByProfileId?profileId={Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidderService.getBidderByProfileId() expects GET /api/bidder/GetByProfileId to exist");
    }

    [Fact]
    public async Task BidderService_GetBidderTypes_EndpointExists()
    {
        // Act
        var response = await _client.GetAsync("/api/bidder/gettypes");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidderService.getBidderTypes() expects GET /api/bidder/gettypes to exist");
    }

    [Fact]
    public async Task BidderService_RegisterBidder_EndpointExists()
    {
        // Act
        var response = await _client.PostAsJsonAsync("/api/bidder/add",
            new { Username = "test@test.com", Password = "test", BidderType = "Caterer" });

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend BidderService.registerBidder() expects POST /api/bidder/add to exist");
    }

    #endregion

    #region Customer Endpoints

    [Fact]
    public async Task CustomerService_GetCurrentCustomer_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/customer/current");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend CustomerService.getCurrentCustomer() expects GET /api/customer/current to exist");
    }

    [Fact]
    public async Task CustomerService_GetAllCustomers_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/customer/getAll");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend CustomerService.getAllCustomers() expects GET /api/customer/getAll to exist");
    }

    [Fact]
    public async Task CustomerService_RegisterCustomer_EndpointExists()
    {
        // Act
        var response = await _client.PostAsJsonAsync("/api/customer/add",
            new { Username = "customer@test.com", Password = "test", FirstName = "Test", LastName = "User" });

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend CustomerService.registerCustomer() expects POST /api/customer/add to exist");
    }

    #endregion

    #region Issue Endpoints

    [Fact]
    public async Task IssueService_GetAllIssues_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/issue/getAll");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend IssueService.getAllIssues() expects GET /api/issue/getAll to exist");
    }

    [Fact]
    public async Task IssueService_CreateIssue_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.PostAsJsonAsync("/api/issue/add",
            new { Title = "Test Issue", Description = "Description" });

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend IssueService.createIssue() expects POST /api/issue/add to exist");
    }

    #endregion

    #region Message Endpoints

    [Fact]
    public async Task MessageService_GetMessagesByOtherProfileId_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync($"/api/message/getByOtherProfileId?otherProfileId={Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend MessageService.getMessagesByOtherProfileId() expects GET /api/message/getByOtherProfileId to exist");
    }

    [Fact]
    public async Task MessageService_SendMessage_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.PostAsJsonAsync("/api/message/add",
            new { ToProfileId = Guid.NewGuid(), Content = "Test message" });

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend MessageService.sendMessage() expects POST /api/message/add to exist");
    }

    [Fact]
    public async Task MessageService_GetAllConversations_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/conversation/getAll");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend MessageService.getAllConversations() expects GET /api/conversation/getAll to exist");
    }

    #endregion

    #region Profile Endpoints

    [Fact]
    public async Task ProfileService_GetCurrent_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/profile/current");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend ProfileService.getCurrent() expects GET /api/profile/current to exist");
    }

    [Fact]
    public async Task ProfileService_Create_EndpointExists()
    {
        // Act
        var response = await _client.PostAsJsonAsync("/api/profile",
            new { Username = "profile@test.com", Password = "test" });

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend ProfileService.create() expects POST /api/profile to exist");
    }

    #endregion

    #region Subscription Endpoints

    [Fact]
    public async Task SubscriptionService_Charge_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.PostAsJsonAsync("/api/subscription/charge",
            new { Token = "test_token" });

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend SubscriptionService.charge() expects POST /api/subscription/charge to exist");
    }

    #endregion

    #region User Endpoints

    [Fact]
    public async Task UserService_GetCurrent_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/user/current");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend UserService.getCurrent() expects GET /api/user/current to exist");
    }

    [Fact]
    public async Task UserService_Exists_EndpointExists()
    {
        // Act
        var response = await _client.GetAsync("/api/user/exists/testuser");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend UserService.exists() expects GET /api/user/exists/{username} to exist");
    }

    [Fact]
    public async Task UserService_GetAll_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/user");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend UserService.getAll() expects GET /api/user to exist");
    }

    [Fact]
    public async Task UserService_GetById_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync($"/api/user/{Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend UserService.getById() expects GET /api/user/{userId} to exist");
    }

    #endregion

    #region Wedding Endpoints

    [Fact]
    public async Task WeddingService_GetAllWeddings_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/wedding/getAll");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend WeddingService.getAllWeddings() expects GET /api/wedding/getAll to exist");
    }

    [Fact]
    public async Task WeddingService_GetWeddingById_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync($"/api/wedding/getById?id={Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend WeddingService.getWeddingById() expects GET /api/wedding/getById to exist");
    }

    [Fact]
    public async Task WeddingService_GetWeddingsByCustomerId_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync($"/api/wedding/getAllByCustomerId?id={Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend WeddingService.getWeddingsByCustomerId() expects GET /api/wedding/getAllByCustomerId to exist");
    }

    [Fact]
    public async Task WeddingService_GetWeddingsByCurrentProfile_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.GetAsync("/api/wedding/getAllByCurrentProfile");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend WeddingService.getWeddingsByCurrentProfile() expects GET /api/wedding/getAllByCurrentProfile to exist");
    }

    [Fact]
    public async Task WeddingService_CreateWedding_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.PostAsJsonAsync("/api/wedding/add",
            new { Date = DateTime.UtcNow.AddMonths(6), Location = "Test Location", GuestCount = 100 });

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend WeddingService.createWedding() expects POST /api/wedding/add to exist");
    }

    [Fact]
    public async Task WeddingService_UpdateWedding_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.PutAsJsonAsync("/api/wedding/update",
            new { WeddingId = Guid.NewGuid(), Date = DateTime.UtcNow.AddMonths(6), Location = "Updated Location" });

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend WeddingService.updateWedding() expects PUT /api/wedding/update to exist");
    }

    [Fact]
    public async Task WeddingService_DeleteWedding_EndpointExists()
    {
        // Act
        var response = await _authenticatedClient.DeleteAsync($"/api/wedding/remove?id={Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            "Frontend WeddingService.deleteWedding() expects DELETE /api/wedding/remove to exist");
    }

    #endregion
}
