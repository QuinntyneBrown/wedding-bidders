using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using WeddingBidders.Core;

namespace WeddingBidders.Api.Features.Messages;

public class GetMessagesByOtherProfileIdRequest : IRequest<GetMessagesByOtherProfileIdResponse>
{
    public Guid OtherProfileId { get; set; }
}

public class GetMessagesByOtherProfileIdResponse
{
    public List<MessageDto> Messages { get; set; } = new();
}

public class GetMessagesByOtherProfileIdHandler : IRequestHandler<GetMessagesByOtherProfileIdRequest, GetMessagesByOtherProfileIdResponse>
{
    private readonly IWeddingBiddersContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetMessagesByOtherProfileIdHandler(IWeddingBiddersContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<GetMessagesByOtherProfileIdResponse> Handle(GetMessagesByOtherProfileIdRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            return new GetMessagesByOtherProfileIdResponse();
        }

        var user = await _context.Users
            .Include(u => u.Profiles)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower(), cancellationToken);

        if (user == null)
        {
            return new GetMessagesByOtherProfileIdResponse();
        }

        var currentProfile = user.Profiles.FirstOrDefault();
        if (currentProfile == null)
        {
            return new GetMessagesByOtherProfileIdResponse();
        }

        var conversation = await _context.Conversations
            .Include(c => c.Profiles)
            .Include(c => c.Messages)
            .Where(c => c.Profiles.Any(p => p.ProfileId == currentProfile.ProfileId))
            .Where(c => c.Profiles.Any(p => p.ProfileId == request.OtherProfileId))
            .FirstOrDefaultAsync(cancellationToken);

        if (conversation == null)
        {
            return new GetMessagesByOtherProfileIdResponse();
        }

        return new GetMessagesByOtherProfileIdResponse
        {
            Messages = conversation.Messages
                .OrderBy(m => m.CreatedDate)
                .Select(m => m.ToDto())
                .ToList()
        };
    }
}
