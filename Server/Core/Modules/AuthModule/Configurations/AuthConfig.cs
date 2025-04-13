using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.AuthModule.Configurations
{
    public class AuthConfig
    {
        public int EmailConfirmationCodeExpiryMinutes { get; set; }
        public int ResetPasswordCodeExpiryMinutes { get; set; }
    }
}
