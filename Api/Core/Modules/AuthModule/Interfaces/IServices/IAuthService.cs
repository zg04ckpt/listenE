using Core.Modules.AuthModule.DTOs;
using Core.Shared.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.AuthModule.Interfaces.IServices
{
    public interface IAuthService
    {
        Task<ApiResult<LoginResponseDto>> LoginAsync(LoginRequestDto request);
        Task<ApiResult<RegisterResponseDto>> RegisterAsync(RegisterRequestDto request);
        Task<ApiResult<bool>> LogoutAsync();
    }
}
