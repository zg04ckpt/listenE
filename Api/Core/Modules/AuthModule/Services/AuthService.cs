using Core.Modules.AuthModule.Configurations;
using Core.Modules.AuthModule.DTOs;
using Core.Modules.AuthModule.Entities;
using Core.Modules.AuthModule.Interfaces.IServices;
using Core.Shared.Interfaces;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Core.Modules.AuthModule.Services
{
    public class AuthService : IAuthService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<UserRole> _userRoleRepository;
        private readonly CookieConfiguration _cookieConfiguration;
        private readonly IHttpContextAccessor _contextAccessor;

        public AuthService(
            IOptions<CookieConfiguration> cookieConfiguration,
            IRepository<User> userRepository,
            IHttpContextAccessor contextAccessor,
            IRepository<UserRole> userRoleRepository)
        {
            _userRepository = userRepository;
            _cookieConfiguration = cookieConfiguration.Value;
            _contextAccessor = contextAccessor;
            _userRoleRepository = userRoleRepository;
        }

        public async Task<ApiResult<LoginResponseDto>> LoginAsync(LoginRequestDto request)
        {
            // Check if user with email exists
            var user = await _userRepository.FindAsync(e => e.Email == request.Email);
            if (user == null) 
            {
                return ApiResult<LoginResponseDto>.Failure(
                    $"User with email {request.Email} does not exist.",
                    ApiErrorCodes.NOT_FOUND,
                    StatusCodes.Status404NotFound);
            }

            // Check if the password is correct
            if (!PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return ApiResult<LoginResponseDto>.Failure(
                    "Password incorrect.",
                    ApiErrorCodes.INVALID_CREDENTIALS,
                    StatusCodes.Status401Unauthorized);
            }

            // prepare params for cookie auth
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            };
            var roleNames = await _userRoleRepository.GetAllAsync<string>(
                ur => ur.UserId == user.Id,
                ur => ur.Role.Name);
            claims.AddRange(roleNames.Select(e => new Claim(ClaimTypes.Role, e)));
            var claimIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = request.Remember,
                ExpiresUtc = request.Remember?
                    DateTimeOffset.UtcNow.AddDays(_cookieConfiguration.LongExpiresInDays):
                    DateTimeOffset.UtcNow.AddMinutes(_cookieConfiguration.ExpiresInMinutes)
            };

            // Login with cookie
            await _contextAccessor.HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimIdentity),
                authProperties);

            return ApiResult<LoginResponseDto>.Success(
                new LoginResponseDto
                {
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ImageUrl = user.ImageUrl
                }, 
                "Login successfully.");
        }

        public Task<ApiResult<bool>> LogoutAsync()
        {
            throw new NotImplementedException();
        }

        public Task<ApiResult<RegisterResponseDto>> RegisterAsync(RegisterRequestDto request)
        {
            throw new NotImplementedException();
        }
    }
}
