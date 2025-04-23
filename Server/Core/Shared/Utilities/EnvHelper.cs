
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
        public static string GetGoogleClientId()
        {
            return Environment.GetEnvironmentVariable("GoogleClientId")!;
        }
        public static string GetGoogleClientSecret()
        {
            return Environment.GetEnvironmentVariable("GoogleClientSecret")!;
        }

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

        public static string GetCloudinaryCloundName()
        {
            return Environment.GetEnvironmentVariable("LISTENE_CLOUDINARY_NAME")
                ?? throw new EnvironmentVariableMissingException("The environment variable 'LISTENE_CLOUDINARY_NAME' was not found.");
        }
        
        public static string GetCloudinaryApiKey()
        {
            return Environment.GetEnvironmentVariable("LISTENE_CLOUDINARY_API_KEY")
                ?? throw new EnvironmentVariableMissingException("The environment variable 'LISTENE_CLOUDINARY_API_KEY' was not found.");
        }

        public static string GetCloudinaryApiSecret()
        {
            return Environment.GetEnvironmentVariable("LISTENE_CLOUDINARY_API_SECRET")
                ?? throw new EnvironmentVariableMissingException("The environment variable 'LISTENE_CLOUDINARY_API_SECRET' was not found.");
        }

        public static string GetSystemEmail()
        {
            return Environment.GetEnvironmentVariable("SYSTEM_EMAIL")
                ?? throw new EnvironmentVariableMissingException("The environment variable 'SYSTEM_EMAIL' was not found.");
        }

        public static string GetSystemEmailPassword()
        {
            return Environment.GetEnvironmentVariable("SYSTEM_EMAIL_APP_PASSWORD")
                ?? throw new EnvironmentVariableMissingException("The environment variable 'SYSTEM_EMAIL_APP_PASSWORD' was not found.");
        }
    }
}
