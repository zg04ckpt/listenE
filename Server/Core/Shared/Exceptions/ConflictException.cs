using Core.Shared.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Exceptions
{
    public class ConflictException : Exception
    {
        public string Code { get; set; }

        public ConflictException(string message, string code = ApiHelper.ErrorCodes.CONFLICT) : base(message)
        {
            Code = code;
        }
    }
}
