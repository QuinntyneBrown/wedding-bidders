using WeddingBidders.Wedding.Core.Model;

namespace WeddingBidders.Wedding.Api.Features.Customers;

public class CustomerDto
{
    public Guid CustomerId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid ProfileId { get; set; }
}

public static class CustomerExtensions
{
    public static CustomerDto ToDto(this Customer customer)
    {
        return new CustomerDto
        {
            CustomerId = customer.CustomerId,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            ProfileId = customer.ProfileId
        };
    }
}
