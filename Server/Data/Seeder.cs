
using Core.Modules.AuthModule.Entities;
using Core.Shared.Exceptions;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Utilities;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public static class Seeder
    {
        public static async Task SeedData(
            AppDbContext _context, 
            IBaseRepository<User> _userRepository, 
            IBaseRepository<Role> _roleRepository,
            IBaseRepository<UserRole> _userRoleRepository)
        {
            await _context.Database.MigrateAsync();
            await SeedRoles(_roleRepository);
            await SeedUsers(_userRepository, _roleRepository, _userRoleRepository);
        }

        private static async Task SeedRoles(IBaseRepository<Role> _roleRepository)
        {
            // Create 3 default roles
            try
            {
                if (!await _roleRepository.ExistsAsync(null))
                {
                    var roleNames = new string[] { "Admin", "User", "Manager" };
                    foreach (var name in roleNames)
                    {
                        await _roleRepository.AddAsync(new()
                        {
                            Name = name,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        });

                    }
                    await _roleRepository.SaveToDatabaseAsync();
                }
            }
            catch (Exception ex)
            {
                throw new DatabaseException($"Failed to initialize default roles: " + ex.Message);
            }
        }

        private static async Task SeedUsers(
            IBaseRepository<User> _userRepository, 
            IBaseRepository<Role> _roleRepository, 
            IBaseRepository<UserRole> _userRoleRepository)
        {
            // Create 2 admin account: one for testing, and one as the default 
            try
            {
                if (!await _userRepository.ExistsAsync(null))
                {
                    var admin = new User
                    {
                        Id = Guid.NewGuid(),
                        FirstName = "Admin",
                        LastName = "System",
                        ImageUrl = "https://res.cloudinary.com/dvk5yt0oi/image/upload/v1742443035/listene/images/hseg5ibhbspzopkced45.jpg",
                        Email = EnvHelper.GetAdminEmail(),
                        IsActivated = true,
                        IsEmailConfirmed = true,
                        PasswordHash = PasswordHasher.Hash(EnvHelper.GetAdminPassword()),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        LastLogin = DateTime.UtcNow,
                    };
                    await _userRepository.AddAsync(admin);
                    var adminRoleId = (await _roleRepository.FindAsync(e => e.Name == "Admin"))!.Id;
                    await _userRoleRepository.AddAsync(new()
                    {
                        RoleId = adminRoleId,
                        UserId = admin.Id
                    });
                    await _userRepository.SaveToDatabaseAsync();
                }
            }
            catch (Exception ex)
            {
                throw new DatabaseException("Failed to initialize default admin: " + ex.Message);
            }
        }
    }
}
