using Core.Modules.AuthModule.DTOs;
using Core.Modules.AuthModule.Interfaces.IServices;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("google/login")]
        public IActionResult GoogleLogin([FromQuery] string returnUrl)
        {
            var props = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(GoogleLoginCallback), new
                {
                    returnUrl
                }),
                Items =
                {
                    { "prompt", "select_account" }
                }
            };
            return Challenge(props, "Google");
        }


        [HttpGet("google/login/callback")]
        public async Task<IActionResult> GoogleLoginCallback([FromQuery] string returnUrl)
        {
            var authenticateResult = await HttpContext.AuthenticateAsync("Google");
            await _authService.GoogleLoginAsync(authenticateResult);
            return Redirect(returnUrl);
        }

        [HttpGet("google/login/result")]
        public async Task<IActionResult> GetGoogleLoginResult()
        {
            return await TryExecute(() => _authService.GetAuthDataAsync(User));
        }
        
        
        [HttpGet("roles")]
        public async Task<IActionResult> GetSystemRoles()
        {
            return await TryExecute(() => _authService.GetAllRolesAsync());
        }
    }
}
