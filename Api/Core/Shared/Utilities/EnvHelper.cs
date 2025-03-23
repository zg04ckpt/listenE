
using Core.Shared.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Utilities
{
    public class EnvHelper
    {
        public static string GetMySQLConnectionString()
        {
            return Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING")
                ?? throw new EnvironmentVariableMissingException("The environment variable 'MYSQL_CONNECTION_STRING' was not found.");
        }

        public static string GetAdminEmail()
        {
            return Environment.GetEnvironmentVariable("ADMIN_EMAIL")
                ?? throw new EnvironmentVariableMissingException("The environment variable 'ADMIN_EMAIL' was not found.");
        }

        public static string GetAdminPassword()
        {
            return Environment.GetEnvironmentVariable("ADMIN_PASSWORD")
                ?? throw new EnvironmentVariableMissingException("The environment variable 'ADMIN_PASSWORD' was not found.");
        }
    }
}
