using Core.Modules.AuthModule.DTOs;
using Core.Shared.Wrappers;
using Microsoft.AspNetCore.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.AuthModule.Interfaces.IServices
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
        Task<ApiResult<RoleListItemDto[]>> GetAllRolesAsync();
    }
}
