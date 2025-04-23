using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.UserModule.DTOs
{
    public class RoleAssignmentDto
    {
        public int UserId { get; set; }
        public int[] RoleIds { get; set; }
    }
}
