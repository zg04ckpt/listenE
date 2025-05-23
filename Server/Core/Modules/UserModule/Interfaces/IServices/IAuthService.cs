using Core.Modules.Auth.DTOs.Auth;
using Core.Shared.Wrappers;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace Core.Modules.Auth.Interfaces.IServices
{
    public interface IAuthService
    {
        Task<ApiResult<LoginResponseDto>> LoginAsync(LoginRequestDto request);
        Task GoogleLoginAsync(AuthenticateResult? data);
        Task<ApiResult<LoginResponseDto>> GetAuthDataAsync(ClaimsPrincipal claimsPrincipal);
        Task<ApiResult<RegisterResponseDto>> RegisterAsync(RegisterRequestDto request);
        Task<ApiResult<object>> LogoutAsync();
        Task<ApiResult<object>> SendResetPasswordCodeAsync(SendResetPasswordCodeRequestDto request);
        Task<ApiResult<object>> SendConfirmEmailCodeAsync(SendConfirmEmailCodeRequestDto request);
        Task<ApiResult<object>> ResetPasswordAsync(ResetPasswordRequestDto request);
        Task<ApiResult<object>> ConfirmEmailAsync(ConfirmEmailRequestDto request);
        
    }
}
