using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Modules.AuthModule.Configurations
{
    public class CookieConfiguration
    {
        public string Name { get; set; }
        public int ExpiresInMinutes { get; set; }
        public int LongExpiresInDays { get; set; }
    }
}
