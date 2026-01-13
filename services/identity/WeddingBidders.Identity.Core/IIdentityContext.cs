using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core.Model;

namespace WeddingBidders.Identity.Core;

public interface IIdentityContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<Privilege> Privileges { get; }
    DbSet<Profile> Profiles { get; }
    DbSet<Account> Accounts { get; }
    DbSet<InvitationToken> InvitationTokens { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
