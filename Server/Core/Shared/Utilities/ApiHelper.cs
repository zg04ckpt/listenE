using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Utilities
{
    public class ApiHelper
    {
        public class ErrorCodes
        {
            public const string NOT_FOUND = "NOT_FOUND";
            public const string USER_NOT_FOUND = "USER_NOT_FOUND";
            public const string RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";

            public const string UNAUTHORIZED = "UNAUTHORIZED";
            public const string INVALID_CREDENTIALS = "INVALID_CREDENTIALS";

            public const string CONFLICT = "CONFLICT";
            public const string ALREADY_EXISTS = "ALREADY_EXISTS";
            public const string DUPLICATE_ACTION = "DUPLICATE_ACTION";

            public const string FORBIDDEN = "FORBIDDEN";

            public const string FAILED_VALIDATION = "FAILED_VALIDATION";

            public const string UNKNOWN_ERROR = "UNKNOWN_ERROR";

            public const string INVALID_REQUEST = "INVALID_REQUEST";
            public const string INVALID_OR_EXPIRED_TOKEN = "INVALID_OR_EXPIRED_TOKEN";

        }
    }
}
