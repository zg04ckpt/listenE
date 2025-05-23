using Core.Modules.Auth.Interfaces.IServices;
using Core.Modules.UserModule.DTOs;
using Core.Modules.UserModule.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.v1
{

    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1")]
    public class UsersController : BaseApiController
    {
        private readonly IUserService _userService;

        public UsersController(
            ILogger<AuthController> logger,
            IUserService userService) : base(logger)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Policy = "OnlyAdmin")]
        public async Task<IActionResult> GetListUser([FromQuery] UserSearchDTO request)
        {
            return await TryExecute(() => _userService.GetUsersPagingAsync(request));
        }

        [HttpGet("roles")]
        [Authorize(Policy = "OnlyAdmin")]
        public async Task<IActionResult> GetSystemRoles()
        {
            return await TryExecute(() => _userService.GetAllRolesAsync());
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            return await TryExecute(() => _userService.GetProfileAsync(User));
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromForm] UserProfileUpdateDto request)
        {
            return await TryExecute(() => _userService.UpdateProfileAsync(User, request));
        }

        [HttpPut("{id}/roles")]
        [Authorize(Policy = "OnlyAdmin")]
        public async Task<IActionResult> AssignRole(int id, [FromBody] RoleAssignmentDto request)
        {
            return await TryExecute(() => _userService.AssignRole(id, request));
        }
    }
}
