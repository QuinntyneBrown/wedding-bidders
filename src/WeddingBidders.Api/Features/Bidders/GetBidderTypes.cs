using MediatR;
using WeddingBidders.Core.Model.BidderAggregate.Enums;

namespace WeddingBidders.Api.Features.Bidders;

public class GetBidderTypesRequest : IRequest<GetBidderTypesResponse>
{
}

public class GetBidderTypesResponse
{
    public List<BidderTypeDto> Types { get; set; } = new();
}

public class BidderTypeDto
{
    public string Name { get; set; } = string.Empty;
    public int Value { get; set; }
}

public class GetBidderTypesHandler : IRequestHandler<GetBidderTypesRequest, GetBidderTypesResponse>
{
    public Task<GetBidderTypesResponse> Handle(GetBidderTypesRequest request, CancellationToken cancellationToken)
    {
        var types = Enum.GetValues<BidderType>()
            .Select(t => new BidderTypeDto
            {
                Name = t.ToString(),
                Value = (int)t
            })
            .ToList();

        return Task.FromResult(new GetBidderTypesResponse { Types = types });
    }
}
