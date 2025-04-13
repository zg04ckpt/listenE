

using System.Text;
using System.Text.RegularExpressions;

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

        public static string GetRandomToken(string source, int length)
        {
            var ran = new Random();
            var sb = new StringBuilder();
            for (int i = 0; i < length; i++)
            {
                sb.Append(source[ran.Next(source.Length)]);
            }
            return sb.ToString();
        }

        public static string ExpandContractions(string input)
        {
            var normalizedInput = input.Replace("’", "'").Trim();
            var contractions = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "i'm", "i am" }, { "you're", "you are" }, { "he's", "he is" },
                { "she's", "she is" }, { "it's", "it is" }, { "we're", "we are" },
                { "they're", "they are" }, { "i've", "i have" }, { "you've", "you have" },
                { "we've", "we have" }, { "they've", "they have" }, { "i'd", "i would" },
                { "he'd", "he would" }, { "she'd", "she would" }, { "we'd", "we would" },
                { "you'd", "you would" }, { "they'd", "they would" }, { "i'll", "i will" },
                { "you'll", "you will" }, { "he'll", "he will" }, { "she'll", "she will" },
                { "it'll", "it will" }, { "we'll", "we will" }, { "they'll", "they will" },
                { "can't", "cannot" }, { "won't", "will not" }, { "don't", "do not" },
                { "doesn't", "does not" }, { "didn't", "did not" }, { "isn't", "is not" },
                { "aren't", "are not" }, { "wasn't", "was not" }, { "weren't", "were not" },
                { "hasn't", "has not" }, { "haven't", "have not" }, { "hadn't", "had not" },
                { "let's", "let us" }, { "who's", "who is" }, { "what's", "what is" },
                { "where's", "where is" }, { "how's", "how is" }, { "there's", "there is" }
            };

            // Generate full regex
            string pattern = @"\b(" + string.Join("|", contractions.Keys.Select(Regex.Escape)) + @")\b";

            return Regex.Replace(normalizedInput, pattern, match =>
            {
                string matched = match.Value;
                string replacement = contractions[matched];

                // Xử lý định dạng in hoa/in thường
                if (matched.All(char.IsUpper))
                {
                    return replacement.ToUpper();
                }
                if (char.IsUpper(matched[0]))
                {
                    return char.ToUpper(replacement[0]) + replacement.Substring(1);
                }
                return replacement;
            }, RegexOptions.IgnoreCase);
        }
    }
}
