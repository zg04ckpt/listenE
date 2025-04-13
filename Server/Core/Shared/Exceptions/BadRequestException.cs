using Core.Shared.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Exceptions
{
    public class BadRequestException : Exception
    {
        public string Code { get; set; }

        public BadRequestException(string message, string code = ApiHelper.ErrorCodes.INVALID_REQUEST) : base(message)
        {
            Code = code;
        }
    }
}
