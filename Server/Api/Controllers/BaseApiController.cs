using Core.Shared.DTOs;
using Core.Shared.Exceptions;
using Core.Shared.Wrappers;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class BaseApiController : Controller
    {
        private readonly ILogger _logger;
        protected BaseApiController(ILogger logger)
        {
            _logger = logger;
        }

        protected async Task<IActionResult> TryExecute<T>(Func<Task<ApiResult<T>>> action, int successCode = 200)
        {
            try
            {
                var result = await action();
                return StatusCode(successCode, result);
            }
            catch (NotFoundException ex)
            {
                return NotFound(new ApiErrorDto
                {
                    Code = ex.Code,
                    Message = ex.Message,
                });
            }
            catch (ConflictException ex)
            {
                return Conflict(new ApiErrorDto
                {
                    Code = ex.Code,
                    Message = ex.Message,
                });
            }
            catch (ForbiddenException ex)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new ApiErrorDto
                    {
                        Code = ex.Code,
                        Message = ex.Message,
                    });
            }
            catch (UnauthorizedException ex)
            {
                return Unauthorized(new ApiErrorDto
                {
                    Code = ex.Code,
                    Message = ex.Message,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred.");
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new ApiErrorDto { 
                        Code = "UNKNOWN_ERROR",
                        Message = "An unexpected error occurred."
                    });
            }
        }
    }
}
