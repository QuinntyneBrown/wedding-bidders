using WeddingBidders.Core.Model.CustomerAggregate;

namespace WeddingBidders.Api.Features.Customers;

public class CustomerDto
{
    public Guid CustomerId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? ProfileId { get; set; }
}

public static class CustomerExtensions
{
    public static CustomerDto ToDto(this Customer customer)
    {
        return new CustomerDto
        {
            CustomerId = customer.CustomerId,
            Firstname = customer.Firstname,
            Lastname = customer.Lastname,
            Email = customer.Email,
            ProfileId = customer.ProfileId
        };
    }
}
