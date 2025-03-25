using Core.Modules.AuthModule.Configurations;
using Core.Modules.AuthModule.DTOs;
using Core.Modules.AuthModule.Entities;
using Core.Modules.AuthModule.Interfaces.IServices;
using Core.Shared.Configurations;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
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
        private readonly IBaseRepository<User> _userRepository;
        private readonly IBaseRepository<Role> _roleRepository;
        private readonly IBaseRepository<UserRole> _userRoleRepository;
        private readonly CookieConfiguration _cookieConfiguration;
        private readonly DefaultValues _defaultValues;
        private readonly IHttpContextAccessor _contextAccessor;

        public AuthService(
            IOptions<CookieConfiguration> cookieConfiguration,
            IOptions<DefaultValues> defaultValues,
            IBaseRepository<User> userRepository,
            IHttpContextAccessor contextAccessor,
            IBaseRepository<UserRole> userRoleRepository,
            IBaseRepository<Role> roleRepository)
        {
            _userRepository = userRepository;
            _cookieConfiguration = cookieConfiguration.Value;
            _defaultValues = defaultValues.Value;
            _contextAccessor = contextAccessor;
            _userRoleRepository = userRoleRepository;
            _roleRepository = roleRepository;
        }

        public async Task<ApiResult<LoginResponseDto>> LoginAsync(LoginRequestDto request)
        {
            // Check if user with email exists
            var user = await _userRepository.FindAsync(e => e.Email == request.Email);
            if (user == null) 
            {
                throw new UnauthorizedException(
                    $"User with email {request.Email} does not exist.",
                    ApiHelper.ErrorCodes.USER_NOT_FOUND);
            }

            // Check if the password is correct
            if (!PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedException(
                    "Password incorrect.",
                    ApiHelper.ErrorCodes.INVALID_CREDENTIALS);
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

            return new ApiResult<LoginResponseDto>
            {
                Message = "Login successfully.",
                Data = new()
                {
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ImageUrl = user.ImageUrl
                }
            };
        }

        public Task<ApiResult<bool>> LogoutAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResult<RegisterResponseDto>> RegisterAsync(RegisterRequestDto request)
        {
            // Check email exists
            if (await _userRepository.ExistsAsync(e => e.Email == request.Email))
            {
                throw new UnauthorizedException(
                    $"User with email {request.Email} already exists.",
                    ApiHelper.ErrorCodes.ALREADY_EXISTS);
            }

            // Create new user
            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                FirstName = StringHelper.ConvertToValidName(request.FirstName),
                LastName = StringHelper.ConvertToValidName(request.LastName),
                ImageUrl = _defaultValues.DefaultImageUrl,
                PasswordHash = PasswordHasher.Hash(request.Password),
                IsActivated = true,
                IsEmailConfirmed = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastLogin = DateTime.UtcNow,
            };
            await _userRepository.AddAsync(newUser);

            // Assign default role (User)
            await _userRoleRepository.AddAsync(new()
            {
                UserId = newUser.Id,
                RoleId = await _roleRepository.FindAsync(e => e.Name == "User", e => e.Id)
            });

            await _userRepository.SaveToDatabaseAsync();

            // Send confirm mail


            return new ApiResult<RegisterResponseDto>
            {
                Message = "Register successfully.",
                Data = new ()
                {
                    Id = newUser.Id,
                    Email = newUser.Email,
                    FirstName = newUser.FirstName,
                    LastName = newUser.LastName,
                    ImageUrl = newUser.ImageUrl,
                    CreatedAt = newUser.CreatedAt,
                    IsActivated = newUser.IsActivated,
                    IsEmailConfirmed = newUser.IsEmailConfirmed,
                }
            };
        }
    }
}
