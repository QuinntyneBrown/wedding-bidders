using System.Diagnostics;
using MediatR;
using Serilog;

namespace WeddingBidders.Api.Behaviours;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LoggingBehavior(IHttpContextAccessor httpContextAccessor)
    {
        _logger = Log.ForContext<LoggingBehavior<TRequest, TResponse>>();
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var userId = _httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value ?? "Anonymous";

        _logger.Information(
            "Handling {RequestName} for UserId: {UserId}",
            requestName,
            userId);

        var stopwatch = Stopwatch.StartNew();

        try
        {
            var response = await next();
            stopwatch.Stop();

            _logger.Information(
                "Handled {RequestName} in {ElapsedMilliseconds}ms for UserId: {UserId}",
                requestName,
                stopwatch.ElapsedMilliseconds,
                userId);

            return response;
        }
        catch (FluentValidation.ValidationException ex)
        {
            stopwatch.Stop();
            _logger.Warning(
                ex,
                "Validation failed for {RequestName} after {ElapsedMilliseconds}ms for UserId: {UserId}. Errors: {ValidationErrors}",
                requestName,
                stopwatch.ElapsedMilliseconds,
                userId,
                string.Join(", ", ex.Errors.Select(e => e.ErrorMessage)));
            throw;
        }
        catch (UnauthorizedAccessException ex)
        {
            stopwatch.Stop();
            _logger.Warning(
                ex,
                "Authorization failed for {RequestName} after {ElapsedMilliseconds}ms for UserId: {UserId}",
                requestName,
                stopwatch.ElapsedMilliseconds,
                userId);
            throw;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.Error(
                ex,
                "Error handling {RequestName} after {ElapsedMilliseconds}ms for UserId: {UserId}",
                requestName,
                stopwatch.ElapsedMilliseconds,
                userId);
            throw;
        }
    }
}
