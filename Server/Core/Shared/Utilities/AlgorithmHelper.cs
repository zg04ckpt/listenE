using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Utilities
{
    public class AlgorithmHelper
    {
        // LCS: Longest Common Subsequence
        public static List<string> GetLCS(string[] a, string[] b)
        {
            int[,] dp = new int[a.Length + 1, b.Length + 1];

            for (int i = 1; i <= a.Length; i++)
                for (int j = 1; j <= b.Length; j++)
                    if (a[i - 1] == b[j - 1])
                        dp[i, j] = dp[i - 1, j - 1] + 1;
                    else
                        dp[i, j] = Math.Max(dp[i - 1, j], dp[i, j - 1]);

            
            var lcs = new List<string>();
            int x = a.Length, y = b.Length;
            while (x > 0 && y > 0)
            {
                if (a[x - 1] == b[y - 1])
                {
                    lcs.Insert(0, a[x - 1]);
                    x--; y--;
                }
                else if (dp[x - 1, y] > dp[x, y - 1])
                    x--;
                else
                    y--;
            }
            return lcs;
        }
    }
}
