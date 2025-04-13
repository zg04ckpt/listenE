using Core.Shared.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Exceptions
{
    public class ForbiddenException : Exception
    {
        public string Code { get; set; }

        public ForbiddenException(string message, string code = ApiHelper.ErrorCodes.FORBIDDEN) : base(message)
        {
            Code = code;
        }
    }
}
