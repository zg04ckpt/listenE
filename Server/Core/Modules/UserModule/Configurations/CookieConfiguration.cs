namespace Core.Modules.Auth.Configurations
{
    public class CookieConfiguration
    {
        public string Name { get; set; }
        public int ExpiresInMinutes { get; set; }
        public int LongExpiresInDays { get; set; }
    }
}
