using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Security.Claims;
using WeddingBidders.Api.Features.Bids;
using WeddingBidders.Core.Model.BidderAggregate;
using WeddingBidders.Core.Model.BidderAggregate.Enums;
using WeddingBidders.Core.Model.CustomerAggregate;
using WeddingBidders.Core.Model.WeddingAggregate;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Features.Bids;

public class CreateBidTests
{
    private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
    private readonly WeddingBiddersContext _context;

    public CreateBidTests()
    {
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

        var options = new DbContextOptionsBuilder<WeddingBiddersContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new WeddingBiddersContext(options);
    }

    [Fact]
    public async Task Handle_ValidRequest_CreatesBid()
    {
        // Arrange
        var bidder = new Bidder
        {
            BidderId = Guid.NewGuid(),
            Firstname = "John",
            Lastname = "Doe",
            Email = "bidder@example.com",
            BidderType = BidderType.Photographer,
            CreatedDate = DateTime.UtcNow
        };

        var customer = new Customer
        {
            CustomerId = Guid.NewGuid(),
            Firstname = "Jane",
            Lastname = "Smith",
            Email = "customer@example.com",
            CreatedDate = DateTime.UtcNow
        };

        var wedding = new Wedding
        {
            WeddingId = Guid.NewGuid(),
            CustomerId = customer.CustomerId,
            NumberOfGuests = 100,
            NumberOfHours = 5,
            Location = "Toronto, ON",
            Date = DateTime.UtcNow.AddMonths(6),
            CreatedDate = DateTime.UtcNow
        };

        _context.Bidders.Add(bidder);
        _context.Customers.Add(customer);
        _context.Weddings.Add(wedding);
        await _context.SaveChangesAsync();

        SetupHttpContext("bidder@example.com");

        var handler = new CreateBidHandler(_context, _httpContextAccessorMock.Object);
        var request = new CreateBidRequest
        {
            WeddingId = wedding.WeddingId,
            Price = 5000.00m,
            Description = "Professional photography services for your wedding"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Price.Should().Be(5000.00m);
        result.Description.Should().Be("Professional photography services for your wedding");

        var bid = await _context.Bids.FirstOrDefaultAsync();
        bid.Should().NotBeNull();
        bid!.BidderId.Should().Be(bidder.BidderId);
        bid.WeddingId.Should().Be(wedding.WeddingId);
    }

    [Fact]
    public async Task Handle_UnauthenticatedUser_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns((HttpContext?)null);

        var handler = new CreateBidHandler(_context, _httpContextAccessorMock.Object);
        var request = new CreateBidRequest
        {
            WeddingId = Guid.NewGuid(),
            Price = 3000.00m,
            Description = "Test bid"
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_BidderNotFound_ThrowsInvalidOperationException()
    {
        // Arrange
        SetupHttpContext("nonexistent@example.com");

        var handler = new CreateBidHandler(_context, _httpContextAccessorMock.Object);
        var request = new CreateBidRequest
        {
            WeddingId = Guid.NewGuid(),
            Price = 3000.00m,
            Description = "Test bid"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(request, CancellationToken.None));
    }

    [Fact]
    public async Task Handle_WeddingNotFound_ThrowsInvalidOperationException()
    {
        // Arrange
        var bidder = new Bidder
        {
            BidderId = Guid.NewGuid(),
            Firstname = "John",
            Lastname = "Doe",
            Email = "bidder@example.com",
            BidderType = BidderType.Caterer,
            CreatedDate = DateTime.UtcNow
        };
        _context.Bidders.Add(bidder);
        await _context.SaveChangesAsync();

        SetupHttpContext("bidder@example.com");

        var handler = new CreateBidHandler(_context, _httpContextAccessorMock.Object);
        var request = new CreateBidRequest
        {
            WeddingId = Guid.NewGuid(),
            Price = 3000.00m,
            Description = "Test bid"
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(request, CancellationToken.None));
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
