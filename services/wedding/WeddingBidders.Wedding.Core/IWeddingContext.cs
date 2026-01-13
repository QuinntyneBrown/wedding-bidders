using Microsoft.EntityFrameworkCore;
using WeddingBidders.Wedding.Core.Model;

namespace WeddingBidders.Wedding.Core;

public interface IWeddingContext
{
    DbSet<Model.Wedding> Weddings { get; }
    DbSet<Customer> Customers { get; }
    DbSet<Category> Categories { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
