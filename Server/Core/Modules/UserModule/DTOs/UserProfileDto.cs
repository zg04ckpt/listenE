using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.UserModule.DTOs
{
    public class UserProfileDto
    {
        public string Email { get; set; }
        public string ImageUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActivated { get; set; }
        public bool IsEmailConfirmed { get; set; }
    }
}
