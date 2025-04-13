using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.DTOs
{
    public class PagingRequestBaseDTO
    {
        public int Page { get; set; }
        public int Size { get; set; }
    }
}
