using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Api.Features.Bids;
using WeddingBidders.Core.Model.BidAggregate;
using WeddingBidders.Core.Model.BidderAggregate;
using WeddingBidders.Core.Model.BidderAggregate.Enums;
using WeddingBidders.Core.Model.CustomerAggregate;
using WeddingBidders.Core.Model.WeddingAggregate;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Features.Bids;

public class GetBidsByWeddingIdTests
{
    private readonly WeddingBiddersContext _context;

    public GetBidsByWeddingIdTests()
    {
        var options = new DbContextOptionsBuilder<WeddingBiddersContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new WeddingBiddersContext(options);
    }

    [Fact]
    public async Task Handle_WeddingWithBids_ReturnsBids()
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

        var bid1 = new Bid
        {
            BidId = Guid.NewGuid(),
            BidderId = bidder.BidderId,
            WeddingId = wedding.WeddingId,
            Price = 5000.00m,
            Description = "Photography package",
            CreatedDate = DateTime.UtcNow
        };

        var bid2 = new Bid
        {
            BidId = Guid.NewGuid(),
            BidderId = bidder.BidderId,
            WeddingId = wedding.WeddingId,
            Price = 7500.00m,
            Description = "Premium photography package",
            CreatedDate = DateTime.UtcNow
        };

        _context.Bidders.Add(bidder);
        _context.Customers.Add(customer);
        _context.Weddings.Add(wedding);
        _context.Bids.AddRange(bid1, bid2);
        await _context.SaveChangesAsync();

        var handler = new GetBidsByWeddingIdHandler(_context);
        var request = new GetBidsByWeddingIdRequest { WeddingId = wedding.WeddingId };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Bids.Should().HaveCount(2);
        result.Bids.Should().Contain(b => b.Price == 5000.00m);
        result.Bids.Should().Contain(b => b.Price == 7500.00m);
    }

    [Fact]
    public async Task Handle_WeddingWithNoBids_ReturnsEmptyList()
    {
        // Arrange
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
            NumberOfGuests = 50,
            NumberOfHours = 3,
            Location = "Vancouver, BC",
            Date = DateTime.UtcNow.AddMonths(4),
            CreatedDate = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        _context.Weddings.Add(wedding);
        await _context.SaveChangesAsync();

        var handler = new GetBidsByWeddingIdHandler(_context);
        var request = new GetBidsByWeddingIdRequest { WeddingId = wedding.WeddingId };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Bids.Should().BeEmpty();
    }

    [Fact]
    public async Task Handle_NonExistentWedding_ReturnsEmptyList()
    {
        // Arrange
        var handler = new GetBidsByWeddingIdHandler(_context);
        var request = new GetBidsByWeddingIdRequest { WeddingId = Guid.NewGuid() };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Bids.Should().BeEmpty();
    }
}
