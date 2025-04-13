using Core.Modules.AuthModule.DTOs;
using Core.Modules.AuthModule.Interfaces.IServices;
using Core.Shared.DTOs;
using Core.Shared.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.v1
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1")]
    public class AuthController : BaseApiController
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService, ILogger<AuthController> logger) : base(logger)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            return await TryExecute(() => _authService.LoginAsync(request));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            return await TryExecute(() => _authService.RegisterAsync(request), 201);
        }

        [HttpPost("send-confirm-email-code")]
        public async Task<IActionResult> SendConfirmEmailCode([FromBody] SendConfirmEmailCodeRequestDto request)
        {
            return await TryExecute(() => _authService.SendConfirmEmailCodeAsync(request));
        }

        [HttpPut("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequestDto request)
        {
            return await TryExecute(() => _authService.ConfirmEmailAsync(request));
        }

        [HttpPost("send-reset-pass-code")]
        public async Task<IActionResult> SendResetPasswordCode([FromBody] SendResetPasswordCodeRequestDto request)
        {
            return await TryExecute(() => _authService.SendResetPasswordCodeAsync(request));
        }

        [HttpPut("reset-pass")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            return await TryExecute(() => _authService.ResetPasswordAsync(request));
        }

        [HttpDelete("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            return await TryExecute(() => _authService.LogoutAsync());
        }
    }
}
