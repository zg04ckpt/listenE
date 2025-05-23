using Core.Shared.DTOs;
using System.ComponentModel.DataAnnotations;

namespace Core.Modules.UserModule.DTOs
{
    public class UserSearchDTO : PagingRequestBaseDTO
    {
        public string? Email { get; set; }
    }
}
