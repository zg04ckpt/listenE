using Core.Shared.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Exceptions
{
    public class ServerErrorException : Exception
    {
        public string Code { get; set; }

        public ServerErrorException(
            string message, 
            string code = ApiHelper.ErrorCodes.UNKNOWN_ERROR) : base(message)
        {
            Code = code;
        }
    }
}
