using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Security.Claims;
using WeddingBidders.Api.Features.Identity;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Features.Identity;

public class ChangePasswordTests
{
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
    private readonly WeddingBiddersContext _context;

    public ChangePasswordTests()
    {
        _passwordHasherMock = new Mock<IPasswordHasher>();
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

        var options = new DbContextOptionsBuilder<WeddingBiddersContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new WeddingBiddersContext(options);
    }

    private void SetupHttpContext(Guid userId)
    {
        var claims = new List<Claim> { new("UserId", userId.ToString()) };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);
        var httpContext = new DefaultHttpContext { User = principal };
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);
    }

    [Fact]
    public async Task Handle_ValidRequest_ChangesPassword()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var oldSalt = new byte[16];
        var newSalt = new byte[16] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 };
        var user = new User
        {
            UserId = userId,
            Username = "test@test.com",
            Password = "oldHashedPassword",
            Salt = oldSalt
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        SetupHttpContext(userId);
        _passwordHasherMock.Setup(x => x.VerifyPassword("oldPassword", "oldHashedPassword", oldSalt)).Returns(true);
        _passwordHasherMock.Setup(x => x.GenerateSalt()).Returns(newSalt);
        _passwordHasherMock.Setup(x => x.HashPassword("newPassword123", newSalt)).Returns("newHashedPassword");

        var handler = new ChangePasswordHandler(_context, _passwordHasherMock.Object, _httpContextAccessorMock.Object);
        var request = new ChangePasswordRequest
        {
            OldPassword = "oldPassword",
            NewPassword = "newPassword123",
            ConfirmationPassword = "newPassword123"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Success.Should().BeTrue();
        var updatedUser = await _context.Users.FirstAsync(u => u.UserId == userId);
        updatedUser.Password.Should().Be("newHashedPassword");
        updatedUser.Salt.Should().BeEquivalentTo(newSalt);
    }

    [Fact]
    public async Task Handle_WrongOldPassword_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User
        {
            UserId = userId,
            Username = "test@test.com",
            Password = "hashedPassword",
            Salt = new byte[16]
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        SetupHttpContext(userId);
        _passwordHasherMock.Setup(x => x.VerifyPassword(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<byte[]>())).Returns(false);

        var handler = new ChangePasswordHandler(_context, _passwordHasherMock.Object, _httpContextAccessorMock.Object);
        var request = new ChangePasswordRequest
        {
            OldPassword = "wrongOldPassword",
            NewPassword = "newPassword123",
            ConfirmationPassword = "newPassword123"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_UserNotAuthenticated_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns((HttpContext?)null);

        var handler = new ChangePasswordHandler(_context, _passwordHasherMock.Object, _httpContextAccessorMock.Object);
        var request = new ChangePasswordRequest
        {
            OldPassword = "oldPassword",
            NewPassword = "newPassword123",
            ConfirmationPassword = "newPassword123"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }
}
