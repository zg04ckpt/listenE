using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Exceptions
{
    public class EnvironmentVariableMissingException : Exception
    {
        public EnvironmentVariableMissingException(string message) : base(message) { }
    }
}
