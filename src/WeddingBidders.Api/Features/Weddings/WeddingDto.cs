using WeddingBidders.Core.Model.WeddingAggregate;

namespace WeddingBidders.Api.Features.Weddings;

public class WeddingDto
{
    public Guid WeddingId { get; set; }
    public int NumberOfGuests { get; set; }
    public int NumberOfHours { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public Guid? CustomerId { get; set; }
    public List<CategoryDto> Categories { get; set; } = new();
}

public class CategoryDto
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public static class WeddingExtensions
{
    public static WeddingDto ToDto(this Wedding wedding)
    {
        return new WeddingDto
        {
            WeddingId = wedding.WeddingId,
            NumberOfGuests = wedding.NumberOfGuests,
            NumberOfHours = wedding.NumberOfHours,
            Location = wedding.Location,
            Date = wedding.Date,
            CustomerId = wedding.CustomerId,
            Categories = wedding.Categories.Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                Name = c.Name
            }).ToList()
        };
    }
}
