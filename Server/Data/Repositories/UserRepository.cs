using Core.Modules.Auth.Entities;
using Core.Modules.UserModule.Interfaces.IRepositories;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Utilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Role[]> GetRolesOfUser(int userId)
        {
            return await _context.UserRoles.AsNoTracking()
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role)
                .ToArrayAsync();
        }

        public async Task SetUserRole(int userId, string[] roles)
        {
            var existingRoles = await _context.UserRoles
                .Where(ur => ur.UserId == userId)
                .AsNoTracking().ToDictionaryAsync(e => e.RoleId);
            var validRoles = await _context.Roles.AsNoTracking()
                .ToDictionaryAsync(e => e.Name);
            foreach (var roleName in roles)
            {
                if (validRoles.TryGetValue(roleName, out var role))
                {
                    if (existingRoles.ContainsKey(role.Id))
                    {
                        existingRoles.Remove(role.Id);
                    }
                    else
                    {
                        await _context.UserRoles.AddAsync(new()
                        {
                            RoleId = role.Id,
                            UserId = userId,
                        });
                    }    
                }
                else
                {
                    throw new NotFoundException(
                        "Role does not exist",
                        ApiHelper.ErrorCodes.RESOURCE_NOT_FOUND);
                }
            }

            _context.UserRoles.RemoveRange(existingRoles.Values);
        }
    }
}
