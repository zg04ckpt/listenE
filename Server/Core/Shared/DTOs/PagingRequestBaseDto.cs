using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.DTOs
{
    public class PagingRequestBaseDTO
    {
        public int Page { get; set; } = 1;
        public int Size { get; set; } = 5;
    }
}
