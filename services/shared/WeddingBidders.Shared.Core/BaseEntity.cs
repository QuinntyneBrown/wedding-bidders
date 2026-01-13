namespace WeddingBidders.Shared.Core;

public abstract class BaseEntity
{
    public bool IsDeleted { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
}
