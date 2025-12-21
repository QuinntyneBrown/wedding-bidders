using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Security.Claims;
using WeddingBidders.Api.Features.Weddings;
using WeddingBidders.Core.Model.CustomerAggregate;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Features.Weddings;

public class CreateWeddingTests
{
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
    private readonly WeddingBiddersContext _context;

    public CreateWeddingTests()
    {
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

        var options = new DbContextOptionsBuilder<WeddingBiddersContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new WeddingBiddersContext(options);
    }

    [Fact]
    public async Task Handle_ValidRequest_CreatesWedding()
    {
        // Arrange
        var customer = new Customer
        {
            CustomerId = Guid.NewGuid(),
            Firstname = "John",
            Lastname = "Doe",
            Email = "customer@example.com",
            CreatedDate = DateTime.UtcNow
        };
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        SetupHttpContext("customer@example.com");

        var handler = new CreateWeddingHandler(_context, _httpContextAccessorMock.Object);
        var request = new CreateWeddingRequest
        {
            NumberOfGuests = 150,
            NumberOfHours = 6,
            Location = "Toronto, ON",
            Date = DateTime.UtcNow.AddMonths(6),
            Categories = new List<CreateCategoryDto>
            {
                new CreateCategoryDto { Name = "Photography" },
                new CreateCategoryDto { Name = "Catering" }
            }
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.NumberOfGuests.Should().Be(150);
        result.NumberOfHours.Should().Be(6);
        result.Location.Should().Be("Toronto, ON");
        result.Categories.Should().HaveCount(2);

        var wedding = await _context.Weddings.Include(w => w.Categories).FirstOrDefaultAsync();
        wedding.Should().NotBeNull();
        wedding!.CustomerId.Should().Be(customer.CustomerId);
    }

    [Fact]
    public async Task Handle_UnauthenticatedUser_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns((HttpContext?)null);

        var handler = new CreateWeddingHandler(_context, _httpContextAccessorMock.Object);
        var request = new CreateWeddingRequest
        {
            NumberOfGuests = 100,
            NumberOfHours = 4,
            Location = "Vancouver, BC",
            Date = DateTime.UtcNow.AddMonths(3)
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_CustomerNotFound_ThrowsInvalidOperationException()
    {
        // Arrange
        SetupHttpContext("nonexistent@example.com");

        var handler = new CreateWeddingHandler(_context, _httpContextAccessorMock.Object);
        var request = new CreateWeddingRequest
        {
            NumberOfGuests = 100,
            NumberOfHours = 4,
            Location = "Montreal, QC",
            Date = DateTime.UtcNow.AddMonths(3)
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_ValidRequestWithoutCategories_CreatesWeddingWithNoCategories()
    {
        // Arrange
        var customer = new Customer
        {
            CustomerId = Guid.NewGuid(),
            Firstname = "Jane",
            Lastname = "Smith",
            Email = "jane@example.com",
            CreatedDate = DateTime.UtcNow
        };
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        SetupHttpContext("jane@example.com");

        var handler = new CreateWeddingHandler(_context, _httpContextAccessorMock.Object);
        var request = new CreateWeddingRequest
        {
            NumberOfGuests = 50,
            NumberOfHours = 3,
            Location = "Ottawa, ON",
            Date = DateTime.UtcNow.AddMonths(4)
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Categories.Should().BeEmpty();
    }

    private void SetupHttpContext(string username)
    {
        var claims = new List<Claim> { new Claim(ClaimTypes.Name, username) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext { User = principal };
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);
    }
}
