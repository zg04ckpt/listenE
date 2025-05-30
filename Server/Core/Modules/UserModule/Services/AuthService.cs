﻿using Core.Modules.Auth.Configurations;
using Core.Modules.Auth.DTOs.Auth;
using Core.Modules.Auth.Entities;
using Core.Modules.Auth.Interfaces.IServices;
using Core.Modules.UserModule.Interfaces.IRepositories;
using Core.Shared.Configurations;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IService;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Core.Modules.Auth.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly CookieConfiguration _cookieConfiguration;
        private readonly DefaultValues _defaultValues;
        private readonly AuthConfig _authConfig;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IRedisService _redisService;
        private readonly IStorageService _storageService;
        private readonly IMailService _mailService;

        public AuthService(
            IOptions<CookieConfiguration> cookieConfiguration,
            IOptions<DefaultValues> defaultValues,
            IOptions<AuthConfig> authConfig,
            IUserRepository userRepository,
            IHttpContextAccessor contextAccessor,
            IRedisService redisService,
            IStorageService storageService,
            IMailService mailService)
        {
            _userRepository = userRepository;
            _cookieConfiguration = cookieConfiguration.Value;
            _defaultValues = defaultValues.Value;
            _contextAccessor = contextAccessor;
            _redisService = redisService;
            _authConfig = authConfig.Value;
            _storageService = storageService;
            _mailService = mailService;
        }

        public async Task<ApiResult<object>> ConfirmEmailAsync(ConfirmEmailRequestDto request)
        {
            // Check token and remove token
            var code = await _redisService.Get(KeyHelper.RedisType.CONFIRM_EMAIL, request.Email);
            if (string.IsNullOrEmpty(code) || code != request.ConfirmCode)
            {
                throw new BadRequestException(
                    "Verification code is invalid or has expired. Please request a new code.",
                    ApiHelper.ErrorCodes.INVALID_OR_EXPIRED_TOKEN);
            }
            await _redisService.Delete(KeyHelper.RedisType.CONFIRM_EMAIL, request.Email);

            // Check user
            var user = await _userRepository.FindAsync(
                e => e.Email == request.Email)
                ?? throw new NotFoundException(
                    $"User with email {request.Email} does not exist. Please register a new account or try a different email.",
                    ApiHelper.ErrorCodes.USER_NOT_FOUND);
            if (user.IsEmailConfirmed)
            {
                throw new ConflictException(
                    "Email has been confirmed.",
                    ApiHelper.ErrorCodes.DUPLICATE_ACTION);
            }

            // Update
            await _userRepository.UpdateAsync(user, e => e.IsEmailConfirmed = true);
            await _userRepository.SaveToDatabaseAsync();

            return new ApiResult<object>
            {
                Message = "Confirm email successfully.",
                Data = null
            };
        }

        public async Task<ApiResult<LoginResponseDto>> GetAuthDataAsync(ClaimsPrincipal claimsPrincipal)
        {
            var userId = Helper.GetUserIdFromClaims(claimsPrincipal);
            var result = await _userRepository.FindAsync(
                e => e.Id == userId,
                e => new LoginResponseDto
                {
                    Email = e.Email,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    ImageUrl = e.ImageUrl
                })
                ?? throw new UnauthorizedException(
                    $"User does not exist.",
                    ApiHelper.ErrorCodes.USER_NOT_FOUND);

            return new ApiResult<LoginResponseDto>
            {
                Data = result
            };
        }

        public async Task GoogleLoginAsync(AuthenticateResult? data)
        {
            if (data is null || !data.Succeeded)
            {
                throw new BadRequestException("Xác thực thất bại");
            }

            // Get email and check if there is already an user with this email
            // If no exist => create new user, else => update lastLogin
            var googleClaims = data.Principal.Claims;
            var email = googleClaims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
                ?? throw new BadRequestException("Thông tin xác thực không hợp lệ.");
            var user = await _userRepository.FindAsync(e => e.Email == email);
            if (user is null)
            {
                user = new User
                {
                    ImageUrl = googleClaims.FirstOrDefault(e => e.Type == "image")?.Value ?? _defaultValues.DefaultImageUrl,
                    FirstName = googleClaims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value ?? "Ẩn danh",
                    LastName = googleClaims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value ?? "",
                    Email = email,
                    PasswordHash = PasswordHasher.Hash(Guid.NewGuid().ToString()),
                    IsEmailConfirmed = true,
                    IsActivated = true,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    LastLogin = DateTime.UtcNow,
                };
                await _userRepository.AddAsync(user);
                await _userRepository.SaveToDatabaseAsync();
            }
            else
            {
                await _userRepository.UpdateAsync(user, user => user.LastLogin = DateTime.UtcNow);
                await _userRepository.SaveToDatabaseAsync();
            }

            // Prepare info for cookie
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            };
            var roles = await _userRepository.GetRolesOfUser(user.Id);
            claims.AddRange(roles.Select(e => new Claim(ClaimTypes.Role, e.Name)));
            var claimIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(_cookieConfiguration.LongExpiresInDays)
            };

            // Login with cookie
            await _contextAccessor.HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimIdentity),
                authProperties);
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
            var roles = await _userRepository.GetRolesOfUser(user.Id);
            claims.AddRange(roles.Select(e => new Claim(ClaimTypes.Role, e.Name)));
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
            await _userRepository.UpdateAsync(user, u => u.LastLogin = DateTime.UtcNow);
            await _userRepository.SaveToDatabaseAsync();

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

        public async Task<ApiResult<object>> LogoutAsync()
        {
            await _contextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return new ApiResult<object>
            {
                Data = null,
                Message = "Logout successfully!"
            };
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
            await _userRepository.SaveToDatabaseAsync();

            // Assign default role (User)
            await _userRepository.SetUserRole(newUser.Id, new string[] { "User" });
            await _userRepository.SaveToDatabaseAsync();

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

        public async Task<ApiResult<object>> ResetPasswordAsync(ResetPasswordRequestDto request)
        {
            // Check token and remove token
            var code = await _redisService.Get(KeyHelper.RedisType.RESET_PASSWORD, request.Email);
            if (string.IsNullOrEmpty(code) || code != request.ConfirmCode)
            {
                throw new BadRequestException(
                    "Verification code is invalid or has expired. Please request a new code.",
                    ApiHelper.ErrorCodes.INVALID_OR_EXPIRED_TOKEN);
            }
            await _redisService.Delete(KeyHelper.RedisType.RESET_PASSWORD, request.Email);

            // Check user
            var user = await _userRepository.FindAsync(
                e => e.Email == request.Email)
                ?? throw new NotFoundException(
                    $"User with email {request.Email} does not exist. Please register a new account or try a different email.",
                    ApiHelper.ErrorCodes.USER_NOT_FOUND);
   
            // Update
            await _userRepository.UpdateAsync(
                user, 
                e => e.PasswordHash = PasswordHasher.Hash(request.Password));
            await _userRepository.SaveToDatabaseAsync();

            return new ApiResult<object>
            {
                Message = "Reset password successfully.",
                Data = null
            };
        }

        public async Task<ApiResult<object>> SendConfirmEmailCodeAsync(SendConfirmEmailCodeRequestDto request)
        {
            // Check if email exists
            var user = await _userRepository.FindAsync(
                e => e.Email == request.Email,
                e => new { e.IsEmailConfirmed })
                ?? throw new NotFoundException(
                    $"User with email {request.Email} does not exist. Please register a new account or try a different email.",
                    ApiHelper.ErrorCodes.USER_NOT_FOUND);
            
            // Check if email already has been confirmed
            if (user.IsEmailConfirmed || await _redisService.IsExists(KeyHelper.RedisType.CONFIRM_EMAIL, request.Email))
            {
                throw new ConflictException(
                    "Email has been confirmed.",
                    ApiHelper.ErrorCodes.DUPLICATE_ACTION);
            }

            // Generate confirm code (6 digits) 
            string code = StringHelper.GetRandomToken("0123456789", 6);
            int maxRetryCount = 20;
            while (await _redisService.IsExists(KeyHelper.RedisType.CONFIRM_EMAIL, request.Email))
            {
                maxRetryCount--;
                if (maxRetryCount < 0)
                {
                    throw new ServerErrorException("Exceeded maximum retries to generate a confirmation email token.");
                }
                code = StringHelper.GetRandomToken("0123456789", 6);
            }

            // Save confirm code by redis
            var result = await _redisService.Set(
                KeyHelper.RedisType.CONFIRM_EMAIL,
                request.Email,
                code,
                TimeSpan.FromMinutes(_authConfig.EmailConfirmationCodeExpiryMinutes));
            if (!result)
            {
                throw new ServerErrorException("Cannot save code to redis.");
            }

            // Send mail
            string template = await _storageService.GetHtmlTemplate("ConfirmEmailTemplate.html");
            template = template.Replace("[code]", code);
            template = template.Replace("[expiryMinutes]", _authConfig.EmailConfirmationCodeExpiryMinutes.ToString());
            result = await _mailService.SendMail(request.Email, "Xác thực email tài khoản ListenE", template);
            if (!result)
            {
                throw new ServerErrorException("Send confirm email code failed");
            }

            return new ApiResult<object>
            {
                Data = null,
                Message = "A 6 digits code was sent to your email, please check mail and use that code to confirm email"
            };
        }

        public async Task<ApiResult<object>> SendResetPasswordCodeAsync(SendResetPasswordCodeRequestDto request)
        {
            // Check if email exists
            if (!await _userRepository.ExistsAsync(e => e.Email == request.Email))
            {
                throw new NotFoundException(
                    $"User with email {request.Email} does not exist. Please register a new account or try a different email.",
                    ApiHelper.ErrorCodes.USER_NOT_FOUND);
            }

            // Check if already send
            if (await _redisService.IsExists(KeyHelper.RedisType.RESET_PASSWORD, request.Email))
            {
                throw new ConflictException(
                    "Token has been sent to your email.",
                    ApiHelper.ErrorCodes.DUPLICATE_ACTION);
            }

            // Generate confirm code (6 digits) 
            string code = StringHelper.GetRandomToken("0123456789", 6);
            int maxRetryCount = 20;
            while (await _redisService.IsExists(KeyHelper.RedisType.RESET_PASSWORD, request.Email))
            {
                maxRetryCount--;
                if (maxRetryCount < 0)
                {
                    throw new ServerErrorException("Exceeded maximum retries to generate a reset password token.");
                }
                code = StringHelper.GetRandomToken("0123456789", 6);
            }

            // Save confirm code by redis
            var result = await _redisService.Set(
                KeyHelper.RedisType.RESET_PASSWORD,
                request.Email,
                code,
                TimeSpan.FromMinutes(_authConfig.EmailConfirmationCodeExpiryMinutes));
            if (!result)
            {
                throw new ServerErrorException("Cannot save code to redis.");
            }

            // Send mail
            string template = await _storageService.GetHtmlTemplate("ResetEmailTemplate.html");
            template = template.Replace("[code]", code);
            template = template.Replace("[expiryMinutes]", _authConfig.ResetPasswordCodeExpiryMinutes.ToString());
            result = await _mailService.SendMail(request.Email, "Yêu cầu thay đổi mật khẩu tài khoản ListenE", template);
            if (!result)
            {
                throw new ServerErrorException("Send reset password code failed");
            }

            return new ApiResult<object>
            {
                Data = null,
                Message = "A 6 digits code was sent to your email, please check mail and use that code to confirm email"
            };
        }
    }
}
