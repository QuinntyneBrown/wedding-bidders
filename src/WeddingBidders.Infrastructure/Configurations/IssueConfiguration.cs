using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeddingBidders.Core.Model.IssueAggregate;

namespace WeddingBidders.Infrastructure.Configurations;

public class IssueConfiguration : IEntityTypeConfiguration<Issue>
{
    public void Configure(EntityTypeBuilder<Issue> builder)
    {
        builder.ToTable("Issues");
        builder.HasKey(i => i.IssueId);
        builder.Property(i => i.Subject).IsRequired().HasMaxLength(256);
        builder.Property(i => i.Content).IsRequired().HasMaxLength(4000);
        builder.HasQueryFilter(i => !i.IsDeleted);

        builder.HasOne(i => i.ReportedBy)
            .WithMany()
            .HasForeignKey(i => i.ReportedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
