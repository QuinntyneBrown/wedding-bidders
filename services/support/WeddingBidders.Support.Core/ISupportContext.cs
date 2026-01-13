using Microsoft.EntityFrameworkCore;
using WeddingBidders.Support.Core.Model;

namespace WeddingBidders.Support.Core;

public interface ISupportContext
{
    DbSet<Issue> Issues { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
