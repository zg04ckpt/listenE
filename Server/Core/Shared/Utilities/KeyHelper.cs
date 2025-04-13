using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Utilities
{
    public class KeyHelper
    {
        public class RedisType
        {
            public const string RESET_PASSWORD = "reset_pass_auth_code";
            public const string CONFIRM_EMAIL = "authentication_email_code";
        }
    }
}
