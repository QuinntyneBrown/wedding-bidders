using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using WeddingBidders.Api.Features.Users;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Features.Users;

public class UpdatePasswordTests
{
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly WeddingBiddersContext _context;

    public UpdatePasswordTests()
    {
        _passwordHasherMock = new Mock<IPasswordHasher>();

        var options = new DbContextOptionsBuilder<WeddingBiddersContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new WeddingBiddersContext(options);
    }

    [Fact]
    public async Task Handle_ValidRequest_UpdatesPassword()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var newSalt = new byte[16] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 };
        var user = new User
        {
            UserId = userId,
            Username = "test@test.com",
            Password = "oldHashedPassword",
            Salt = new byte[16]
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _passwordHasherMock.Setup(x => x.GenerateSalt()).Returns(newSalt);
        _passwordHasherMock.Setup(x => x.HashPassword("newPassword123", newSalt)).Returns("newHashedPassword");

        var handler = new UpdatePasswordHandler(_context, _passwordHasherMock.Object);
        var request = new UpdatePasswordRequest
        {
            UserId = userId,
            Password = "newPassword123"
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
    public async Task Handle_UserNotFound_ThrowsInvalidOperationException()
    {
        // Arrange
        var handler = new UpdatePasswordHandler(_context, _passwordHasherMock.Object);
        var request = new UpdatePasswordRequest
        {
            UserId = Guid.NewGuid(),
            Password = "newPassword123"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(request, CancellationToken.None));
    }
}
