using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.UserModule.DTOs
{
    public class UserListItemDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime LastLogin { get; set; }
        public bool IsActivated { get; set; }
        public string[] Roles { get; set; }
    }
}
