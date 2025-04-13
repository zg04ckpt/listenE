
using Core.Shared.DTOs;
using Core.Shared.Utilities;

namespace Api.Middlewares
{
    public class HandleGlobalExceptionMiddleware : IMiddleware
    {
        private readonly ILogger<HandleGlobalExceptionMiddleware> _logger;

        public HandleGlobalExceptionMiddleware(ILogger<HandleGlobalExceptionMiddleware> logger)
        {
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred.");
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await context.Response.WriteAsJsonAsync(new ApiErrorDto
                {
                    Code = ApiHelper.ErrorCodes.UNKNOWN_ERROR,
                    Message = "An unexpected error occurred."
                });
            }
        }
    }
}
