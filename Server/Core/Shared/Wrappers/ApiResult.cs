using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Wrappers
{
    public class ApiResult<T>
    {
        public string Status { get; } = "success";
        public string? Message { get; set; }
        public T? Data { get; set; }
    }
}
