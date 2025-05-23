using Core.Modules.Auth.Entities;
using Core.Shared.Interfaces.IRepository;

namespace Core.Modules.UserModule.Interfaces.IRepositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task SetUserRole(int userId, string[] roles);
        Task<Role[]> GetRolesOfUser(int userId);
    }
}
