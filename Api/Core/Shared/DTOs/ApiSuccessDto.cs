using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.DTOs
{
    public class ApiSuccessDto
    {
        public string? Message { get; set; }
        public object? Data { get; set; }
    }
}
