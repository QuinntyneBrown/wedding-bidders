using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using WeddingBidders.Api.Features.Identity;
using WeddingBidders.Core;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Features.Identity;

public class AuthenticateTests
{
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly WeddingBiddersContext _context;

    public AuthenticateTests()
    {
        _passwordHasherMock = new Mock<IPasswordHasher>();
        _tokenServiceMock = new Mock<ITokenService>();

        var options = new DbContextOptionsBuilder<WeddingBiddersContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new WeddingBiddersContext(options);
    }

    [Fact]
    public async Task Handle_ValidCredentials_ReturnsAuthenticateResponse()
    {
        // Arrange
        var salt = new byte[16];
        var hashedPassword = "hashedPassword";
        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "test@test.com",
            Password = hashedPassword,
            Salt = salt,
            Roles = new List<Role>
            {
                new Role { RoleId = Guid.NewGuid(), Name = "Member", Privileges = new List<Privilege>() }
            }
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _passwordHasherMock.Setup(x => x.VerifyPassword("password123", hashedPassword, salt)).Returns(true);
        _tokenServiceMock.Setup(x => x.GenerateAccessToken(It.IsAny<IEnumerable<System.Security.Claims.Claim>>())).Returns("jwt_token");
        _tokenServiceMock.Setup(x => x.GenerateRefreshToken()).Returns("refresh_token");

        var handler = new AuthenticateHandler(_context, _passwordHasherMock.Object, _tokenServiceMock.Object);
        var request = new AuthenticateRequest { Username = "test@test.com", Password = "password123" };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.UserId.Should().Be(user.UserId);
        result.Token.Should().Be("jwt_token");
        result.RefreshToken.Should().Be("refresh_token");
    }

    [Fact]
    public async Task Handle_InvalidUsername_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var handler = new AuthenticateHandler(_context, _passwordHasherMock.Object, _tokenServiceMock.Object);
        var request = new AuthenticateRequest { Username = "nonexistent@test.com", Password = "password123" };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_InvalidPassword_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var salt = new byte[16];
        var hashedPassword = "hashedPassword";
        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "test@test.com",
            Password = hashedPassword,
            Salt = salt,
            Roles = new List<Role>()
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _passwordHasherMock.Setup(x => x.VerifyPassword("wrongpassword", hashedPassword, salt)).Returns(false);

        var handler = new AuthenticateHandler(_context, _passwordHasherMock.Object, _tokenServiceMock.Object);
        var request = new AuthenticateRequest { Username = "test@test.com", Password = "wrongpassword" };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_DeletedUser_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var user = new User
        {
            UserId = Guid.NewGuid(),
            Username = "deleted@test.com",
            Password = "hashedPassword",
            Salt = new byte[16],
            IsDeleted = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var handler = new AuthenticateHandler(_context, _passwordHasherMock.Object, _tokenServiceMock.Object);
        var request = new AuthenticateRequest { Username = "deleted@test.com", Password = "password123" };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }
}
