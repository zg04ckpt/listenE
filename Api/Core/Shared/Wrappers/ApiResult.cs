using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Wrappers
{
    public class ApiResult<T>
    {
        public int StatusCode { get; private set; }
        public T? Data { get; private set; }
        public string? Message { get; private set; }
        public string? ErrorCode { get; private set; }

        public ApiResult(T? data, string? message)
        {
            if (data == null && message == null)
            {
                StatusCode = StatusCodes.Status204NoContent;
            }
            else
            {
                StatusCode = StatusCodes.Status200OK;
                Data = data;
                Message = message;
            }
        }

        public ApiResult(string errorMessage, string errorCode, int statusCode)
        {
            StatusCode = statusCode;
            ErrorCode = errorCode;
            Message = errorMessage;
        }

        public static ApiResult<T> Success(T? data, string? message)
        {
            return new ApiResult<T>(data, message);
        }
        public static ApiResult<T> Failure(string errorMessage, string errorCode, int statusCode)
        {
            return new ApiResult<T>(errorMessage, errorCode, statusCode);
        }
    }
}
