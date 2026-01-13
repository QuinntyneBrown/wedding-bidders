using Microsoft.EntityFrameworkCore;
using WeddingBidders.Support.Core;
using WeddingBidders.Support.Core.Model;

namespace WeddingBidders.Support.Infrastructure;

public class SupportContext : DbContext, ISupportContext
{
    public SupportContext(DbContextOptions<SupportContext> options) : base(options)
    {
    }

    public DbSet<Issue> Issues => Set<Issue>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Issue>(entity =>
        {
            entity.HasKey(i => i.IssueId);
            entity.Property(i => i.Subject).IsRequired().HasMaxLength(200);
            entity.Property(i => i.Content).IsRequired();
            entity.HasQueryFilter(i => !i.IsDeleted);
        });

        base.OnModelCreating(modelBuilder);
    }
}
