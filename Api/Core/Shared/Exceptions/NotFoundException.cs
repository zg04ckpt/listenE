using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Exceptions
{
    public class NotFoundException : Exception
    {
        public string Code { get; set; }

        public NotFoundException(string message, string code = "NOT_FOUND") : base(message)
        {
            Code = code;
        }
    }
}
