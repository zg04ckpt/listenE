

namespace Core.Shared.Utilities
{
    public class StringHelper
    {
        public static string ConvertToValidName(string src)
        {
            string[] names = src.Split(" ")
                .Where(e => !string.IsNullOrEmpty(e))
                .Select(e => e[..1].ToUpper() + e[1..].ToLower())
                .ToArray();
            return string.Join(" ", names);
        }
    }
}
