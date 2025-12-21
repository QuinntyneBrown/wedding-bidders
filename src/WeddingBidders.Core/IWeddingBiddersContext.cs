using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core.Model.InvitationTokenAggregate;
using WeddingBidders.Core.Model.ProfileAggregate;
using WeddingBidders.Core.Model.UserAggregate;

namespace WeddingBidders.Core;

public interface IWeddingBiddersContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<Privilege> Privileges { get; }
    DbSet<Profile> Profiles { get; }
    DbSet<InvitationToken> InvitationTokens { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
