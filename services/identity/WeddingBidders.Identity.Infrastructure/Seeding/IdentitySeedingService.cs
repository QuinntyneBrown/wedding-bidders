using Microsoft.EntityFrameworkCore;
using WeddingBidders.Identity.Core;
using WeddingBidders.Identity.Core.Model;
using WeddingBidders.Identity.Core.Services;

namespace WeddingBidders.Identity.Infrastructure.Seeding;

public class IdentitySeedingService
{
    private readonly IIdentityContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public IdentitySeedingService(IIdentityContext context, IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task SeedAsync()
    {
        await SeedRolesAsync();
        await SeedUsersAsync();
        await _context.SaveChangesAsync();
    }

    private async Task SeedRolesAsync()
    {
        if (await _context.Roles.AnyAsync())
            return;

        var systemAdminRole = new Role
        {
            RoleId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
            Name = "SystemAdministrator",
            Privileges = CreateSystemAdminPrivileges()
        };

        var memberRole = new Role
        {
            RoleId = Guid.Parse("00000000-0000-0000-0000-000000000002"),
            Name = "Member",
            Privileges = CreateMemberPrivileges()
        };

        _context.Roles.Add(systemAdminRole);
        _context.Roles.Add(memberRole);
    }

    private static List<Privilege> CreateSystemAdminPrivileges()
    {
        var aggregates = new[] { "User", "Role", "Profile", "InvitationToken", "Account" };
        var accessRights = new[] { AccessRight.Read, AccessRight.Write, AccessRight.Create, AccessRight.Delete };
        var privileges = new List<Privilege>();

        foreach (var aggregate in aggregates)
        {
            foreach (var accessRight in accessRights)
            {
                privileges.Add(new Privilege
                {
                    PrivilegeId = Guid.NewGuid(),
                    Aggregate = aggregate,
                    AccessRight = accessRight
                });
            }
        }

        return privileges;
    }

    private static List<Privilege> CreateMemberPrivileges()
    {
        return new List<Privilege>
        {
            new() { PrivilegeId = Guid.NewGuid(), Aggregate = "Profile", AccessRight = AccessRight.Read },
            new() { PrivilegeId = Guid.NewGuid(), Aggregate = "Profile", AccessRight = AccessRight.Write }
        };
    }

    private async Task SeedUsersAsync()
    {
        if (await _context.Users.AnyAsync())
            return;

        var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "SystemAdministrator");
        if (adminRole == null) return;

        var salt = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword("Admin123!", salt);

        var adminUser = new User
        {
            UserId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
            Username = "admin@weddingbidders.com",
            Password = hashedPassword,
            Salt = salt,
            Roles = new List<Role> { adminRole }
        };

        _context.Users.Add(adminUser);
    }
}
