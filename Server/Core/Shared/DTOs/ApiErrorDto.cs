using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.DTOs
{
    public class ApiErrorDto
    {
        public string Status { get; } = "error";
        public string? Message { get; set; }
        public string Code { get; set; }
    }
}
