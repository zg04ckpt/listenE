using Core.Shared.DTOs;
using Core.Shared.Wrappers;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    public class BaseApiController : Controller
    {
        protected IActionResult AutoChooseStatusCode<T>(ApiResult<T> apiResult)
        {
            if (apiResult.StatusCode == StatusCodes.Status200OK)
            {
                return Ok(new ApiSuccessDto
                {
                    Data = apiResult.Data,
                    Message = apiResult.Message,
                });
            } 
            else if (apiResult.StatusCode == StatusCodes.Status204NoContent)
            {
                return NoContent();
            } 
            else if (apiResult.StatusCode >= 200 && apiResult.StatusCode < 300)
            {
                return StatusCode(apiResult.StatusCode, new ApiSuccessDto
                {
                    Data = apiResult.Data,
                    Message = apiResult.Message,
                });
            }
            else
            {
                return StatusCode(apiResult.StatusCode, new ApiErrorDto
                {
                    Code = apiResult.ErrorCode ?? "UNKNOWN_ERROR",
                    Error = apiResult.Message ?? "An unexpected error occurred.",
                });
            }
        }
    }
}
