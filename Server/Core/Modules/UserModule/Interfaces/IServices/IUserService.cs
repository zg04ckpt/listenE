using Core.Modules.UserModule.DTOs;
using Core.Shared.DTOs;
using Core.Shared.Wrappers;
using System.Security.Claims;

namespace Core.Modules.UserModule.Interfaces.IServices
{
    public interface IUserService
    {
        Task<ApiResult<RoleListItemDto[]>> GetAllRolesAsync();
        Task<ApiResult<Paginated<UserListItemDto>>> GetUsersPagingAsync(UserSearchDTO request);
        Task<ApiResult<object>> AssignRole(int userId, RoleAssignmentDto request);
        Task<ApiResult<UserProfileDto>> GetProfileAsync(ClaimsPrincipal claims);
        Task<ApiResult<UpdateResponseDto>> UpdateProfileAsync(ClaimsPrincipal claims, UserProfileUpdateDto request);
    }
}
