using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using WeddingBidders.Api.Features.Customers;
using WeddingBidders.Core.Model.UserAggregate;
using WeddingBidders.Core.Services;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Features.Customers;

public class RegisterCustomerTests
{
    private readonly Mock<IPasswordHasher> _passwordHasherMock;
    private readonly WeddingBiddersContext _context;

    public RegisterCustomerTests()
    {
        _passwordHasherMock = new Mock<IPasswordHasher>();

        var options = new DbContextOptionsBuilder<WeddingBiddersContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new WeddingBiddersContext(options);
    }

    [Fact]
    public async Task Handle_ValidRequest_ReturnsSuccessResponse()
    {
        // Arrange
        var salt = new byte[16];
        var hashedPassword = "hashedPassword";

        var memberRole = new Role { RoleId = Guid.NewGuid(), Name = "Member", Privileges = new List<Privilege>() };
        _context.Roles.Add(memberRole);
        await _context.SaveChangesAsync();

        _passwordHasherMock.Setup(x => x.GenerateSalt()).Returns(salt);
        _passwordHasherMock.Setup(x => x.HashPassword("Password123", salt)).Returns(hashedPassword);

        var handler = new RegisterCustomerHandler(_context, _passwordHasherMock.Object);
        var request = new RegisterCustomerRequest
        {
            Firstname = "Jane",
            Lastname = "Doe",
            Email = "jane.doe@example.com",
            Password = "Password123",
            ConfirmPassword = "Password123"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.CustomerId.Should().NotBeNull();
        result.Message.Should().Be("Registration successful");

        var customer = await _context.Customers.FirstOrDefaultAsync();
        customer.Should().NotBeNull();
        customer!.Firstname.Should().Be("Jane");
        customer.Lastname.Should().Be("Doe");
        customer.Email.Should().Be("jane.doe@example.com");
    }

    [Fact]
    public async Task Handle_DuplicateEmail_ReturnsFailureResponse()
    {
        // Arrange
        var existingUser = new User
        {
            UserId = Guid.NewGuid(),
            Username = "existing@example.com",
            Password = "hashedPassword",
            Salt = new byte[16]
        };
        _context.Users.Add(existingUser);
        await _context.SaveChangesAsync();

        var handler = new RegisterCustomerHandler(_context, _passwordHasherMock.Object);
        var request = new RegisterCustomerRequest
        {
            Firstname = "John",
            Lastname = "Doe",
            Email = "existing@example.com",
            Password = "Password123",
            ConfirmPassword = "Password123"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeFalse();
        result.Message.Should().Be("Email already exists");
        result.CustomerId.Should().BeNull();
    }

    [Fact]
    public async Task Handle_ValidRequest_CreatesUserProfileAndAccount()
    {
        // Arrange
        var salt = new byte[16];
        var hashedPassword = "hashedPassword";

        _passwordHasherMock.Setup(x => x.GenerateSalt()).Returns(salt);
        _passwordHasherMock.Setup(x => x.HashPassword("Password123", salt)).Returns(hashedPassword);

        var handler = new RegisterCustomerHandler(_context, _passwordHasherMock.Object);
        var request = new RegisterCustomerRequest
        {
            Firstname = "Alice",
            Lastname = "Smith",
            Email = "alice.smith@example.com",
            Password = "Password123",
            ConfirmPassword = "Password123"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Success.Should().BeTrue();

        var user = await _context.Users.Include(u => u.Profiles).FirstOrDefaultAsync();
        user.Should().NotBeNull();
        user!.Username.Should().Be("alice.smith@example.com");
        user.Profiles.Should().HaveCount(1);

        var account = await _context.Accounts.FirstOrDefaultAsync();
        account.Should().NotBeNull();
        account!.Email.Should().Be("alice.smith@example.com");
    }
}
