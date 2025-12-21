using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Security.Claims;
using WeddingBidders.Api.Authorization;
using WeddingBidders.Api.Behaviours;

namespace WeddingBidders.Api.Tests.Behaviours;

public class ResourceOperationAuthorizationBehaviorTests
{
    private readonly Mock<IAuthorizationService> _authorizationServiceMock;
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;

    public ResourceOperationAuthorizationBehaviorTests()
    {
        _authorizationServiceMock = new Mock<IAuthorizationService>();
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
    }

    private void SetupHttpContext(bool isAuthenticated, params string[] privileges)
    {
        var claims = new List<Claim>();
        if (isAuthenticated)
        {
            claims.Add(new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()));
            foreach (var privilege in privileges)
            {
                claims.Add(new Claim("privilege", privilege));
            }
        }
        var identity = new ClaimsIdentity(claims, isAuthenticated ? "Test" : null);
        var principal = new ClaimsPrincipal(identity);
        var httpContext = new DefaultHttpContext { User = principal };
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);
    }

    [Fact]
    public async Task Handle_RequestWithoutAuthorization_ProceedsToNext()
    {
        // Arrange
        SetupHttpContext(false);
        var behavior = new ResourceOperationAuthorizationBehavior<RequestWithoutAuth, string>(
            _authorizationServiceMock.Object, _httpContextAccessorMock.Object);

        var nextCalled = false;
        Task<string> Next()
        {
            nextCalled = true;
            return Task.FromResult("success");
        }

        // Act
        var result = await behavior.Handle(new RequestWithoutAuth(), Next, CancellationToken.None);

        // Assert
        nextCalled.Should().BeTrue();
        result.Should().Be("success");
    }

    [Fact]
    public async Task Handle_AuthorizedRequest_ProceedsToNext()
    {
        // Arrange
        SetupHttpContext(true, "ReadUser");
        _authorizationServiceMock.Setup(x => x.AuthorizeAsync(
            It.IsAny<ClaimsPrincipal>(),
            It.IsAny<object?>(),
            It.IsAny<IEnumerable<IAuthorizationRequirement>>()))
            .ReturnsAsync(AuthorizationResult.Success());

        var behavior = new ResourceOperationAuthorizationBehavior<RequestWithAuth, string>(
            _authorizationServiceMock.Object, _httpContextAccessorMock.Object);

        var nextCalled = false;
        Task<string> Next()
        {
            nextCalled = true;
            return Task.FromResult("success");
        }

        // Act
        var result = await behavior.Handle(new RequestWithAuth(), Next, CancellationToken.None);

        // Assert
        nextCalled.Should().BeTrue();
        result.Should().Be("success");
    }

    [Fact]
    public async Task Handle_UnauthorizedRequest_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetupHttpContext(true);
        _authorizationServiceMock.Setup(x => x.AuthorizeAsync(
            It.IsAny<ClaimsPrincipal>(),
            It.IsAny<object?>(),
            It.IsAny<IEnumerable<IAuthorizationRequirement>>()))
            .ReturnsAsync(AuthorizationResult.Failed());

        var behavior = new ResourceOperationAuthorizationBehavior<RequestWithAuth, string>(
            _authorizationServiceMock.Object, _httpContextAccessorMock.Object);

        Task<string> Next() => Task.FromResult("success");

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            behavior.Handle(new RequestWithAuth(), Next, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_UnauthenticatedUser_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        SetupHttpContext(false);
        var behavior = new ResourceOperationAuthorizationBehavior<RequestWithAuth, string>(
            _authorizationServiceMock.Object, _httpContextAccessorMock.Object);

        Task<string> Next() => Task.FromResult("success");

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            behavior.Handle(new RequestWithAuth(), Next, CancellationToken.None));
    }

    private class RequestWithoutAuth : IRequest<string> { }

    [AuthorizeResourceOperation(Operations.Read, AggregateNames.User)]
    private class RequestWithAuth : IRequest<string> { }
}
