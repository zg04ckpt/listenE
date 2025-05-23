using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Utilities
{
    public class Helper
    {
        public static int? GetUserIdFromClaims(ClaimsPrincipal claims)
        {
            var data = claims.FindFirstValue(ClaimTypes.NameIdentifier);
            if (data == null) return null;
            return int.Parse(data);
        }
    }
}
