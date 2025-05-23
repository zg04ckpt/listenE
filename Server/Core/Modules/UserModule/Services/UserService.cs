using Core.Modules.Auth.Entities;
using Core.Modules.UserModule.DTOs;
using Core.Modules.UserModule.Interfaces.IRepositories;
using Core.Modules.UserModule.Interfaces.IServices;
using Core.Shared.Configurations;
using Core.Shared.DTOs;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Interfaces.IService;
using Core.Shared.Utilities;
using Core.Shared.Wrappers;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Core.Modules.UserModule.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly DefaultValues _defaultValues;
        private readonly IBaseRepository<Role> _roleRepository;
        private readonly IStorageService _storageService;

        public UserService(
            IUserRepository userRepository,
            IBaseRepository<Role> roleRepository,
            IOptions<DefaultValues> defaultValues,
            IStorageService storageService)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _storageService = storageService;
            _defaultValues = defaultValues.Value;
        }

        public async Task<ApiResult<object>> AssignRole(int userId, RoleAssignmentDto request)
        {
            if (!await _userRepository.ExistsAsync(e => e.Id == userId))
            {
                throw new NotFoundException(
                    $"User does not exist.",
                    ApiHelper.ErrorCodes.USER_NOT_FOUND);
            }
            await _userRepository.SetUserRole(userId, request.Roles);
            await _userRepository.SaveToDatabaseAsync();
            return new ApiResult<object>
            {
                Data = null,
                Message = "Role assigned successfully!"
            };
        }


        public async Task<ApiResult<RoleListItemDto[]>> GetAllRolesAsync()
        {
            return new ApiResult<RoleListItemDto[]>
            {
                Data = (await _roleRepository.GetAllAsync(
                    e => true,
                    projection: e => new RoleListItemDto
                    {
                        Id = e.Id,
                        Name = e.Name,
                    })).ToArray()
            };
        }

        public async Task<ApiResult<UserProfileDto>> GetProfileAsync(ClaimsPrincipal claims)
        {
            var user = await _userRepository.FindAsync(
                predicate: u => u.Id == Helper.GetUserIdFromClaims(claims),
                projection: u => new UserProfileDto
                {
                    Email = u.Email,
                    FirstName = u.FirstName,
                    ImageUrl = u.ImageUrl,
                    IsActivated = u.IsActivated,
                    IsEmailConfirmed = u.IsEmailConfirmed,
                    LastName = u.LastName
                })
                ?? throw new NotFoundException(
                        "User does not exist",
                        ApiHelper.ErrorCodes.USER_NOT_FOUND
                    );

            return new ApiResult<UserProfileDto>
            {
                Data = user
            };
        }

        public async Task<ApiResult<Paginated<UserListItemDto>>> GetUsersPagingAsync(UserSearchDTO request)
        {
            var predicateBuilder = new PredicateBuilder<User>();
            if (!string.IsNullOrEmpty(request.Email))
            {
                predicateBuilder.AndCondition(u => u.Email.Contains(request.Email));
            }
            var users = await _userRepository.GetPaginatedAsync(
                predicate: predicateBuilder.GetPredicateOrDefault(),
                page: request.Page,
                size: request.Size,
                sortBy: null,
                isAsc: true,
                projection: u => new UserListItemDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    CreatedAt = u.CreatedAt,
                    ImageUrl = u.ImageUrl,
                    IsActivated = u.IsActivated,
                    IsEmailConfirmed = u.IsEmailConfirmed,
                    LastLogin = u.LastLogin,
                    UpdatedAt = u.UpdatedAt,
                    Roles = u.UserRoles.Select(ur => ur.Role.Name).ToArray()
                });

            return new ApiResult<Paginated<UserListItemDto>>
            {
                Data = users,
            };
        }

        public async Task<ApiResult<UpdateResponseDto>> UpdateProfileAsync(ClaimsPrincipal claims, UserProfileUpdateDto request)
        {
            var user = await _userRepository.FindAsync(
                predicate: u => u.Id == Helper.GetUserIdFromClaims(claims))
                ?? throw new NotFoundException(
                        "User does not exist",
                        ApiHelper.ErrorCodes.USER_NOT_FOUND
                    );

            // Update image
            if (request.Image != null)
            {
                if (user.ImageUrl != _defaultValues.DefaultImageUrl)
                    await _storageService.RemoveImage(user.ImageUrl);
                user.ImageUrl = await _storageService.SaveImage(request.Image)
                    ?? throw new ServerErrorException("Failed to save new image");
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveToDatabaseAsync();
            return new ApiResult<UpdateResponseDto>
            {
                Data = new()
                {
                    Id = user.Id,
                    UpdatedAt = user.UpdatedAt
                }
            };
        }
    }
}
