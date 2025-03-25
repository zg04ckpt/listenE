using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Exceptions
{
    public class UnauthorizedException : Exception
    {
        public string Code { get; set; }

        public UnauthorizedException(string message, string code = "UNAUTHORIZED") : base(message)
        {
            Code = code;
        }
    }
}
